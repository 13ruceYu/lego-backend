import { Controller } from 'egg';
import sharp from 'sharp';
import { parse, join, extname } from 'path';
import { nanoid } from 'nanoid';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import * as sendToWormhole from 'stream-wormhole';
import busboy from 'busboy';
import { FileStream } from '../../typings/app';
import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';

export default class UtilsController extends Controller {
  async fileLocalUpload() {
    const { ctx, app } = this;
    const { filepath } = ctx.request.files[0];
    // 生成 sharp 实例
    const imageSource = sharp(filepath);
    const metaData = await imageSource.metadata();
    app.logger.debug(metaData);
    // 检查图片宽度是否大于 300
    let thumbnailUrl = '';
    if (metaData.width && metaData.width > 300) {
      // gen a new file path
      // /uploads/**/abc.png -> /uploads/**/abc-thumbnail.png
      const { name, ext, dir } = parse(filepath);
      app.logger.info(name, ext, dir);
      const thumbnailFilePath = join(dir, `${name}-thumbnail${ext}`);
      await imageSource.resize({ width: 300 }).toFile(thumbnailFilePath);
      thumbnailUrl = thumbnailFilePath.replace(app.config.baseDir, app.config.baseUrl);
    }

    const url = filepath.replace(app.config.baseDir, app.config.baseUrl);
    ctx.helper.success({ ctx, res: { url, thumbnailUrl: thumbnailUrl ? thumbnailUrl : url } });
  }
  pathToURL(path: string) {
    const { app } = this;
    return path.replace(app.config.baseDir, app.config.baseUrl);
  }
  async fileUploadByStream() {
    const { ctx, app } = this;
    const stream = await ctx.getFileStream();
    // save at uploads/**.ext uploads/**_thumbnail.ext
    const uid = nanoid(6);
    const saveFilePath = join(app.config.baseDir, 'uploads', uid + extname(stream.filename));
    const saveThumbnailPath = join(app.config.baseDir, 'uploads', uid + '_thumbnail' + extname(stream.filename));

    const target = createWriteStream(saveFilePath);
    const target2 = createWriteStream(saveThumbnailPath);

    const savePromise = pipeline(stream, target);
    const transformer = sharp().resize({ width: 300 });
    const saveThumbnailPromise = pipeline(stream, transformer, target2);
    try {
      await Promise.all([ savePromise, saveThumbnailPromise ]);
      ctx.helper.success({ ctx, res: { url: this.pathToURL(saveFilePath), thumbnailUrl: this.pathToURL(saveThumbnailPath) } });
    } catch (e) {
      ctx.helper.error({ ctx, errorType: 'imgUploadFail' });
    }
  }
  async uploadToOss() {
    const { ctx } = this;
    const stream = await ctx.getFileStream();
    const saveOssPath = join('imooc-test', nanoid(6) + extname(stream.filename));
    try {
      const result = await ctx.oss.put(saveOssPath, stream);
      const { name, url } = result;
      ctx.helper.success({ ctx, res: { name, url } });
    } catch (err) {
      await sendToWormhole(stream);
      ctx.helper.error({ ctx, errorType: 'imgUploadFail' });
    }
  }
  uploadFileUseBusboy() {
    const { ctx, app } = this;
    return new Promise(resolve => {
      const bsb = busboy({ headers: ctx.req.headers as any });
      const results: string[] = [];
      bsb.on('file', (name, file, info) => {
        console.log('----on file----', name, file, info);
        const uid = nanoid(6);
        const savedFilePath = join(app.config.baseDir, 'uploads', uid + extname(info.filename));
        file.pipe(createWriteStream(savedFilePath));
        file.on('end', () => {
          results.push(savedFilePath);
        });
      });
      bsb.on('field', (name, val) => {
        console.log(`----Field [${name}]: value: %j----`, val);
      });
      bsb.on('finish', () => {
        console.log('----finish----');
        resolve(results);
      });
      ctx.req.pipe(bsb);
    });
  }
  async testBusboy() {
    const { ctx } = this;
    const results = await this.uploadFileUseBusboy();
    ctx.helper.success({ ctx, res: results });
  }
  async uploadMultipleFiles() {
    const { ctx, app } = this;
    const { fileSize } = app.config.multipart;
    const parts = ctx.multipart({ limits: { fileSize: fileSize as number } });
    const urls: string[] = [];
    let part: FileStream | string[];
    // 还能这么写。。
    while ((part = await parts())) {
      if (Array.isArray(part)) {
        console.log('---part---', part);
      } else {
        try {
          const saveOssPath = join('imooc-test', nanoid(6) + extname(part.filename));
          const result = await ctx.oss.put(saveOssPath, part);
          const { url } = result;
          urls.push(url);
          if (part.truncated) {
            await ctx.oss.delete(saveOssPath);
            return ctx.helper.error({ ctx, errorType: 'imageUploadFailSizeError', error: `Reach fileSize limit ${fileSize} bytes` });
          }
        } catch (err) {
          await sendToWormhole(part);
          ctx.helper.error({ ctx, errorType: 'imgUploadFail' });
        }
      }
    }
    ctx.helper.success({ ctx, res: { urls } });
  }
  async renderH5Page() {
    const { ctx } = this;
    const vueApp = createSSRApp({
      data: () => ({ msg: 'hello ssr' }),
      template: '<h1>{{msg}}</h1>',
    });
    const appContent = await renderToString(vueApp);
    ctx.response.type = 'text/html';
    ctx.body = appContent;

  }
}
