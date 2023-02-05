import { subject } from '@casl/ability';
import { permittedFieldsOf } from '@casl/ability/extra';
import { Controller } from 'egg';
import { difference } from 'lodash';
import { GlobalErrorTypes } from '../error';
import defineRoles from '../roles/roles';

const caslMethodMapping: Record<string, string> = {
  GET: 'read',
  POST: 'create',
  PATCH: 'update',
  DELETE: 'delete',
};

const options = { fieldsFrom: rule => rule.fields || [] };

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
      let keyPermission = true;
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
      // 判断 rule 中是否有对应的受限字段
      if (rule && rule.fields) {
        const fields = permittedFieldsOf(ability, action, modelName, options);
        if (fields.length > 0) {
          // 过滤 request body
          // or 获取当前 payloadKeys 和允许的 fields 做比较
          const payloadKeys = Object.keys(ctx.request.body);
          const diffKeys = difference(payloadKeys, fields);
          keyPermission = diffKeys.length === 0;
        }
      }
      if (!permission || !keyPermission) {
        return ctx.helper.error({ ctx, errorType });
      }
      await originalMethod.apply(this, args);
    };
  };
}
