import { Controller } from 'egg';
import { GlobalErrorTypes } from '../error';
import defineRoles from '../roles/roles';
import { subject } from '@casl/ability';
import { permittedFieldsOf } from '@casl/ability/extra';
import { difference, assign } from 'lodash/fp';

const caslMethodMapping: Record<string, string> = {
  GET: 'read',
  POST: 'create',
  PATCH: 'update',
  DELETE: 'delete',
};

interface IModelMapping {
  mongoose: string;
  casl: string;
}

interface IOptions {
  action?: string;
  // model 查找 record 时的 key，默认为 id
  key?: string;
  // 修改 record field 的数据来源（ctx.params.valueKey | ctx.request.body.valueKey）
  value?: { type: 'params' | 'body', valueKey: string };
}

const defaultSearchOptions: IOptions = {
  key: 'id',
  value: { type: 'params', valueKey: 'id' },
};

const fieldsOptions = {
  fieldsFrom: rule => rule.fields || [/* list of all fields for Article */],
};

/**
 * Check permission decorator
 * @param modelName mongoose model name | casl and modelName mapping
 * @param errorType errorType
 * @param options 自定义 action & 查询条件
 */
export default function checkPermission(modelName: string | IModelMapping, errorType: GlobalErrorTypes, options?: IOptions) {
  return function(prototype, key: string, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      const that = this as Controller;
      // eslint-disable-next-line
      // @ts-ignore
      const { ctx } = that;
      const { method } = ctx.request;
      const action = (options && options.action) ? options.action : caslMethodMapping[method];
      const searchOptions = assign(defaultSearchOptions, options || {});
      const { key, value } = searchOptions;
      const { type, valueKey } = value!;
      const source = type === 'params' ? ctx.params : ctx.request.body;
      const query = {
        [key!]: source[valueKey],
      };
      const mongooseModelName = typeof modelName === 'string' ? modelName : modelName.mongoose;
      const caslModelName = typeof modelName === 'string' ? modelName : modelName.casl;
      if (!ctx.state && !ctx.state.user) {
        return ctx.helper.error({ ctx, errorType });
      }
      // 获取定义的 role
      const ability = defineRoles(ctx.state.user);
      const rule = ability.relevantRuleFor(action, caslModelName);
      let permission = false;
      let keyPermission = true;
      if (rule && rule.conditions) {
        const certainRecord = await ctx.model[mongooseModelName].findOne(query).lean();
        permission = ability.can(action, subject(caslModelName, certainRecord));
      } else {
        permission = ability.can(action, caslModelName);
      }
      // 判断 rule 中是否有受限字
      if (rule && rule.fields) {
        const fields = permittedFieldsOf(ability, action, caslModelName, fieldsOptions);
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
