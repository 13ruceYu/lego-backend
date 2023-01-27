import { Controller } from 'egg';
import inputValidator from '../decorator/inputValidator';

const workCreateRules = {
  title: 'string',
};

export default class WorkController extends Controller {
  @inputValidator(workCreateRules, 'workValidateFail')
  async createWork() {
    const { ctx, service } = this;
    const workData = await service.work.createEmptyWork(ctx.request.body);
    ctx.helper.success({ ctx, res: workData });
  }
}
