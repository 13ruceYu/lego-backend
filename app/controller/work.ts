import { Controller } from 'egg';
import validateInput from '../decorator/inputValidate';
import checkPermission from '../decorator/checkPermission';
import { nanoid } from 'nanoid';

export interface IIndexCondition {
  pageIndex?: number;
  pageSize?: number;
  select?: string | string[];
  populate?: { path?: string, select: string | string[] } | '';
  customSort?: Record<string, any>;
  find?: Record<string, any>;
}

const workCreateRules = {
  title: 'string',
};

const channelCreateRules = {
  name: 'string',
  workId: 'number',
};

export default class WorkController extends Controller {
  @checkPermission('Work', 'workNoPermissionFail')
  async myWork() {
    const { ctx } = this;
    const { id } = ctx.params;
    const res = await this.ctx.model.Work.findOne({ id }).lean();
    ctx.helper.success({ ctx, res });
  }

  @validateInput(channelCreateRules, 'channelValidateFail')
  @checkPermission({ casl: 'Channel', mongoose: 'Work' }, 'workNoPermissionFail', { value: { type: 'body', valueKey: 'workId' } })
  async createChannel() {
    const { ctx } = this;
    const { name, workId } = ctx.request.body;
    const newChannel = {
      name,
      id: nanoid(6),
    };

    const res = await ctx.model.Work.findOneAndUpdate({ id: workId }, { $push: { channels: newChannel } });
    if (res) {
      ctx.helper.success({ ctx, res: newChannel });
    } else {
      ctx.helper.error({ ctx, errorType: 'channelOperateFail' });
    }
  }

  @checkPermission({ mongoose: 'Work', casl: 'Channel' }, 'workNoPermissionFail')
  async getWorkChannel() {
    const { ctx } = this;
    const { id } = ctx.params;
    const res = await ctx.model.Work.findOne({ id });
    if (res) {
      const channels = res.channels || [];
      ctx.helper.success({ ctx, res: { count: channels.length, list: channels } });
    } else {
      ctx.helper.error({ ctx, errorType: 'channelOperateFail' });
    }
  }

  @checkPermission({ mongoose: 'Work', casl: 'Channel' }, 'workNoPermissionFail', { key: 'channels.id' })
  async updateChannelName() {
    const { ctx } = this;
    const { id } = ctx.params;
    const { name } = ctx.request.body;
    await ctx.model.Work.findOneAndUpdate({ 'channels.id': id }, { $set: { 'channels.$.name': name } });
    ctx.helper.success({ ctx, res: { name } });
  }

  @checkPermission({ mongoose: 'Work', casl: 'Channel' }, 'workNoPermissionFail', { key: 'channels.id' })
  async deleteChannel() {
    const { ctx } = this;
    const { id } = ctx.params;
    const work = await ctx.model.Work.findOneAndUpdate({ 'channels.id': id }, { $pull: { channels: { id } } }, { new: true });
    ctx.helper.success({ ctx, res: work });
  }

  @validateInput(workCreateRules, 'workValidateFail')
  @checkPermission('Work', 'workNoPermissionFail')
  async createWork() {
    const { ctx, service } = this;
    const workData = await service.work.createEmptyWork(ctx.request.body);
    ctx.helper.success({ ctx, res: workData });
  }

  @checkPermission('Work', 'workNoPermissionFail')
  async myList() {
    const { ctx } = this;
    const userId = ctx.state.user._id;
    const { pageIndex, pageSize, isTemplate, title } = ctx.query;
    const findCondition = {
      user: userId,
      ...(title && { title: { $regex: title, $options: 'i' } }),
      ...(isTemplate && { isTemplate: !!parseInt(isTemplate) }),
    };
    const listCondition: IIndexCondition = {
      select: [ 'id', 'author', 'copiedCount', 'coverImg', 'desc', 'title', 'user', 'isHot', 'createdAt' ],
      populate: { path: 'user', select: [ 'username', 'nickName', 'picture' ] },
      find: findCondition,
      ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
      ...(pageSize && { pageSize: parseInt(pageSize) }),
    };
    const res = await ctx.service.work.getList(listCondition);
    ctx.helper.success({ ctx, res });
  }
  async templateList() {
    const { ctx } = this;
    const { pageIndex, pageSize } = ctx.query;
    const listCondition: IIndexCondition = {
      select: [ 'id', 'author', 'copiedCount', 'coverImg', 'desc', 'title', 'user', 'isHot', 'createdAt' ],
      populate: { path: 'user', select: [ 'username', 'nickName', 'picture' ] },
      find: { isPublic: true, isTemplate: true },
      // find: { isTemplate: true },
      ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
      ...(pageSize && { pageSize: parseInt(pageSize) }),
    };
    const res = await ctx.service.work.getList(listCondition);
    ctx.helper.success({ ctx, res });
  }
  @checkPermission('Work', 'workNoPermissionFail')
  async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const payload = ctx.request.body;
    const res = await this.ctx.model.Work.findOneAndUpdate({ id }, payload, { new: true });
    ctx.helper.success({ ctx, res });
  }
  @checkPermission('Work', 'workNoPermissionFail')
  async delete() {
    const { ctx } = this;
    const { id } = ctx.params;
    const res = await ctx.model.Work.findOneAndDelete({ id }).select([ '_id', 'id', 'title' ]);
    ctx.helper.success({ ctx, res });
  }
  @checkPermission('Work', 'workNoPermissionFail', { action: 'publish' })
  async publish(isTemplate: boolean) {
    const { ctx } = this;
    const url = await ctx.service.work.publish(ctx.params.id, isTemplate);
    ctx.helper.success({ ctx, res: url });
  }
  async publishWork() {
    await this.publish(false);
  }
  async publishTemplate() {
    await this.publish(true);
  }
}
