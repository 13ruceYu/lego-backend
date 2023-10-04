import { Controller } from 'egg';
import validateInput from '../decorator/inputValidate';

export interface IIndexCondition {
  pageIndex?: number;
  pageSize?: number;
  select?: string | string[];
  populate?: { path?: string, select: string | string[] } | '';
  customSort?: Record<string, any>;
  find?: Record<string, any>;
}

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

  async myList() {
    const { ctx } = this;
    const userId = ctx.state.user._id
    const { pageIndex, pageSize, isTemplate, title } = ctx.query;
    const findCondition = {
      user: userId,
      ...(title && { title: { $regex: title, $options: 'i' } }),
      ...(isTemplate && { isTemplate: !!parseInt(isTemplate) })
    }
    const listCondition: IIndexCondition = {
      select: [ 'id', 'author', 'copiedCount', 'coverImg', 'desc', 'title', 'user', 'isHot', 'createdAt' ],
      populate: { path: 'user', select: [ 'username', 'nickName', 'picture' ] },
      find: findCondition,
      ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
      ...(pageSize && { pageSize: parseInt(pageSize) })
    };
    const res = await ctx.service.work.getList(listCondition)
    ctx.helper.success({ ctx, res })
  }
  async templateList() {
    const { ctx } = this;
    const { pageIndex, pageSize } = ctx.query;
    const listCondition: IIndexCondition = {
      select: [ 'id', 'author', 'copiedCount', 'coverImg', 'desc', 'title', 'user', 'isHot', 'createdAt' ],
      populate: { path: 'user', select: [ 'username', 'nickName', 'picture' ] },
      find: { isPublic: true, isTemplate: true },
      ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
      ...(pageSize && { pageSize: parseInt(pageSize) })
    };
    const res = await ctx.service.work.getList(listCondition);
    ctx.helper.success({ ctx, res });
  }
}
