import { Controller } from 'egg';
import * as sharp from 'sharp';
import { parse, join, extname } from 'path';
import { nanoid } from 'nanoid';
import { createWriteStream } from 'fs';

export default class UtilsController extends Controller {
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
    const savePromise = new Promise(async (resolve, reject) => {
      (await stream).pipe(target).on('finish', resolve).on('error', reject);
    });
    const transformer = sharp().resize({ width: 300 });
    const thumbnailPromise = new Promise(async (resolve, reject) => {
      (await stream).pipe(transformer).pipe(targetThumbnail)
        .on('finish', resolve)
        .on('error', reject);
    });
    await Promise.all([ savePromise, thumbnailPromise ]);
    ctx.helper.success({ ctx, res: { url: this.pathToUrl(savedFilePath), thumbnailUrl: this.pathToUrl(savedThumbnailPath) } });
  }
}
