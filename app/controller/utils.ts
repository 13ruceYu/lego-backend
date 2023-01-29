import { Controller } from 'egg';
import sharp from 'sharp';
import { parse, join } from 'path';

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
}
