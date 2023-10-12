import { Controller } from 'egg';
import * as sharp from 'sharp';
import { parse, join } from 'path';

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
      console.log({ name, ext, dir });
      const thumbnailFilePath = join(dir, `${name}-thumbnail${ext}`);
      await imageSource.resize({ width: 300 }).toFile(thumbnailFilePath);
      thumbnailUrl = thumbnailFilePath.replace(app.config.baseDir, app.config.baseUrl);
    }
    const url = filepath.replace(app.config.baseDir, app.config.baseUrl);
    ctx.helper.success({ ctx, res: { url, thumbnailUrl: thumbnailUrl ? thumbnailUrl : url } });
  }
}
