import { WorkProps } from './../model/work';
import { Service } from 'egg';
import { nanoid } from 'nanoid';
import { Types } from 'mongoose';
import { IndexCondition } from '../controller/work';

const defaultIndexCondition: Required<IndexCondition> = {
  pageIndex: 0,
  pageSize: 10,
  select: '',
  populate: {},
  customSort: { createdAt: -1 },
  find: {},
};

export default class WorkService extends Service {
  async createEmptyWork(payload) {
    const { ctx } = this;
    const { username, _id } = ctx.state.user;
    const uuid = nanoid(6);
    const newEmptyWork: Partial<WorkProps> = {
      ...payload,
      user: Types.ObjectId(_id),
      author: username,
      uuid,
    };
    return ctx.model.Work.create(newEmptyWork);
  }
  async getList(condition: IndexCondition) {
    const fCondition = { ...defaultIndexCondition, ...condition };
    const { pageIndex, pageSize, select, populate, customSort, find } = fCondition;
    const skip = pageIndex * pageSize;
    const res = await this.ctx.model.Work
      .find(find)
      .select(select)
      .populate(populate)
      .skip(skip)
      .limit(pageSize)
      .sort(customSort)
      .lean();
    const count = await this.ctx.model.Work.find(find).count();
    return { count, list: res, pageIndex, pageSize };
  }
}
