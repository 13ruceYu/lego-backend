import { Service } from 'egg';
import { nanoid } from 'nanoid'
import { IWorkProps } from '../model/work';
import { Types } from 'mongoose';

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
}
