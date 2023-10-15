import { Controller } from 'egg';
import * as sharp from 'sharp';
import { parse, join, extname } from 'path';
import { nanoid } from 'nanoid';
import { createWriteStream } from 'fs';
import { pipeline } from 'node:stream/promises';
import sendToWormhole from 'stream-wormhole';
import { FileStream } from '../../typings/app';

export default class UtilsController extends Controller {
  async uploadToOSS() {
    const { ctx, app } = this;
    const stream = await ctx.getFileStream();
    // lego-backend-vue/imooc-test/uuid.ext
    const saveOSSPath = join('imooc-test', nanoid(6) + extname(stream.filename));
    try {
      const result = await ctx.oss.put(saveOSSPath, stream);
      app.logger.info({ result });
      const { url, name } = result;
      ctx.helper.success({ ctx, res: { url, name } });
    } catch (e) {
      await sendToWormhole(stream);
      ctx.helper.error({ ctx, errorType: 'imageUploadFail' });
    }
  }
  async uploadMultipleFiles() {
    const { ctx, app } = this;
    const parts = ctx.multipart();
    const { fileSize } = app.config.multipart;
    const urls: string[] = [];
    let part: FileStream | string[];
    while ((part = await parts())) {
      if (!Array.isArray(part)) {
        try {
          const savedOSSPath = join('imooc-test', nanoid(6) + extname(part.filename));
          const result = await ctx.oss.put(savedOSSPath, part);
          const { url } = result;
          urls.push(url);
          if (part.truncated) {
            await ctx.oss.delete(savedOSSPath);
            return ctx.helper.error({ ctx, errorType: 'imageUploadFileSizeError', error: `fileSize limit ${fileSize} bytes` });
          }
        } catch (e) {
          await sendToWormhole(part);
          ctx.helper.error({ ctx, errorType: 'imageUploadFail' });
        }
      }
    }
    ctx.helper.success({ ctx, res: urls });
  }
  async fileLocalUpload() {
    const { ctx, app } = this;
    const { filepath } = ctx.request.files[0];
    // 生成 sharp 实例
    const imageSource = sharp(filepath);
    const metaData = await imageSource.metadata();
    let thumbnailUrl = '';
    if (metaData.width && metaData.width > 300) {
      // generate new file path
      const { name, ext, dir } = parse(filepath);
      const thumbnailFilePath = join(dir, `${name}-thumbnail${ext}`);
      await imageSource.resize({ width: 300 }).toFile(thumbnailFilePath);
      thumbnailUrl = thumbnailFilePath.replace(app.config.baseDir, app.config.baseUrl);
    }
    const url = filepath.replace(app.config.baseDir, app.config.baseUrl);
    ctx.helper.success({ ctx, res: { url, thumbnailUrl: thumbnailUrl ? thumbnailUrl : url } });
  }
  pathToUrl(path: string) {
    const { app } = this;
    return path.replace(app.config.baseDir, app.config.baseUrl);
  }
  async fileUploadByStream() {
    const { ctx, app } = this;
    const stream = ctx.getFileStream();
    // uploads/uuid.ext
    // uploads/uuid_thumbnail.ext
    const uuid = nanoid(6);
    const savedFilePath = join(app.config.baseDir, 'uploads', uuid + extname((await stream).filename));
    const savedThumbnailPath = join(app.config.baseDir, 'uploads', uuid + '_thumbnail' + extname((await stream).filename));
    const target = createWriteStream(savedFilePath);
    const targetThumbnail = createWriteStream(savedThumbnailPath);
    const savePromise = pipeline(await stream, target);
    const transformer = sharp().resize({ width: 300 });
    const thumbnailPromise = pipeline(await stream, transformer, targetThumbnail);
    try {
      await Promise.all([ savePromise, thumbnailPromise ]);
    } catch (e) {
      return ctx.helper.error({ ctx, errorType: 'imageUploadFail' });
    }
    ctx.helper.success({ ctx, res: { url: this.pathToUrl(savedFilePath), thumbnailUrl: this.pathToUrl(savedThumbnailPath) } });
  }
}
