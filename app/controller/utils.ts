import { Controller } from 'egg';

export default class UtilsController extends Controller {
  async fileLocalUpload() {
    const { ctx, app } = this;
    const file = ctx.request.files[0];
    const url = file.filepath.replace(app.config.baseDir, app.config.baseUrl);
    ctx.helper.success({ ctx, res: { url } });
  }
}
