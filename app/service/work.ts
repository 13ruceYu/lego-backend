import { Service } from 'egg';
import { nanoid } from 'nanoid'
import { IWorkProps } from '../model/work';
import { Types } from 'mongoose';
import { IIndexCondition } from '../controller/work'

const defaultIndexCondition: Required<IIndexCondition> = {
  pageIndex: 0,
  pageSize: 10,
  select: '',
  populate: '',
  customSort: { createdAt: -1 },
  find: {}

}

export default class WorkService extends Service {
  async createEmptyWork(payload) {
    const { ctx } = this;
    const { username, _id } = ctx.state.user;
    const uuid = nanoid(6);
    const newEmptyWork: Partial<IWorkProps> = {
      ...payload,
      user: Types.ObjectId(_id),
      author: username,
      uuid
    }
    return ctx.model.Work.create(newEmptyWork);
  }
  async getList(condition: IIndexCondition) {
    const { ctx } = this;
    const fCondition = { ...defaultIndexCondition, ...condition };
    const { pageIndex, pageSize, select, populate, customSort, find } = fCondition;
    const skip = pageIndex * pageSize;
    const list = await ctx.model.Work
      .find(find).select(select).populate(populate)
      .skip(skip)
      .limit(pageSize)
      .sort(customSort)
      .lean();
    const count = await ctx.model.Work.find(find).count();
    return {
      list,
      count,
      pageSize,
      pageIndex
    }
  }
}
