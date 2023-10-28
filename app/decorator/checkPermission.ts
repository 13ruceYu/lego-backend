import { Controller } from 'egg';
import { GlobalErrorTypes } from '../error';
import defineRoles from '../roles/roles';
import { subject } from '@casl/ability';
import { permittedFieldsOf } from '@casl/ability/extra';
import { difference } from 'lodash';

const caslMethodMapping: Record<string, string> = {
  GET: 'read',
  POST: 'create',
  PATCH: 'update',
  DELETE: 'delete',
};

const options = {
  fieldsFrom: rule => rule.fields || [/* list of all fields for Article */],
};

export default function checkPermission(modelName: string, errorType: GlobalErrorTypes) {
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
      let keyPermission = true;
      if (rule && rule.conditions) {
        const certainRecord = await ctx.model[modelName].findOne({ id }).lean();
        permission = ability.can(action, subject(modelName, certainRecord));
      } else {
        permission = ability.can(action, modelName);
      }
      // 判断 rule 中是否有受限字段
      if (rule && rule.fields) {
        const fields = permittedFieldsOf(ability, action, modelName, options);
        if (fields.length > 0) {
          const payloadKeys = Object.keys(ctx.request.body);
          const diffKeys = difference(payloadKeys, fields);
          keyPermission = diffKeys.length === 0;
        }
      }
      if (!permission || !keyPermission) {
        return ctx.helper.error({ ctx, errorType });
      }
      await originMethod.apply(this, args);
    };
  };
}
