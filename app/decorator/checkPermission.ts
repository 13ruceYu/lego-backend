import { Controller } from 'egg';
import { GlobalErrorTypes } from '../error';
import defineRoles from '../roles/roles';
import { subject } from '@casl/ability';

const caslMethodMapping: Record<string, string> = {
  GET: 'read',
  POST: 'create',
  PATCH: 'update',
  DELETE: 'delete',
};

export default function checkPermission(modelName: string, errorType: GlobalErrorTypes, userKey = 'user') {
  return function(prototype, key: string, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value;
    descriptor.value = async function(args) {
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
      // 获取定义的 role
      const ability = defineRoles(ctx.state.user);
      const rule = ability.relevantRuleFor(action, modelName);
      let permission = false;
      if (rule && rule.conditions) {
        const certainRecord = await ctx.model[modelName].findOne({ id }).lean();
        permission = ability.can(action, subject(modelName, certainRecord));
      } else {
        permission = ability.can(action, modelName);
      }
      if (!permission) {
        return ctx.helper.error({ ctx, errorType });
      }
      await originMethod.apply(this, args);
    };
  };
}
