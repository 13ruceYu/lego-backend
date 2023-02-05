import { subject } from '@casl/ability';
import { Controller } from 'egg';
import { GlobalErrorTypes } from '../error';
import defineRoles from '../roles/roles';

const caslMethodMapping: Record<string, string> = {
  GET: 'read',
  POST: 'create',
  PATCH: 'update',
  DELETE: 'delete',
};

export default function checkPermission(modelName: string, errorType: GlobalErrorTypes) {
  return function(_prototype, _key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      const that = this as Controller;
      // eslint-disable-next-line
      // @ts-ignore
      const { ctx } = that;
      const { id } = ctx.params;
      const { method } = ctx.request;
      const action = caslMethodMapping[method];
      if (!ctx.state && !ctx.state.user) {
        return ctx.helper.error({ ctx, errorType });
      }
      let permission = false;
      // 获取定义的 roles
      const ability = defineRoles(ctx.state.user);
      // 获取 rule 来判断是否存在对应的条件
      const rule = ability.relevantRuleFor(action, modelName);
      if (rule && rule.conditions) {
        const certainRecord = await ctx.model[modelName].findOne({ id }).lean();
        permission = ability.can(action, subject(modelName, certainRecord));
      } else {
        permission = ability.can(action, modelName);
      }
      // const userId = ctx.state.user._id;
      // const certainRecord = await ctx.model[modelName].findOne({ id });
      if (!permission) {
        return ctx.helper.error({ ctx, errorType });
      }
      await originalMethod.apply(this, args);
    };
  };
}
