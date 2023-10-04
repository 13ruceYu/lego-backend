import { Controller } from 'egg';
import validateInput from '../decorator/inputValidate';

const workCreateRules = {
  title: 'string'
}

export default class WorkController extends Controller {
  @validateInput(workCreateRules, 'workValidateFail')
  async createWork() {
    const { ctx, service } = this;
    const workData = await service.work.createEmptyWork(ctx.request.body);
    ctx.helper.success({ ctx, res: workData });
  }
}
