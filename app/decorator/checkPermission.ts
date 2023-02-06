import { subject } from '@casl/ability';
import { permittedFieldsOf } from '@casl/ability/extra';
import { Controller } from 'egg';
import { difference, assign } from 'lodash/fp';
import { GlobalErrorTypes } from '../error';
import defineRoles from '../roles/roles';

const caslMethodMapping: Record<string, string> = {
  GET: 'read',
  POST: 'create',
  PATCH: 'update',
  DELETE: 'delete',
};

interface ModelMapping {
  mongoose: string;
  casl: string;
}

interface IOptions {
  // 自定义 action
  action?: string;
  // 查找记录时候的 key，默认为 id
  key?: string;
  // 查找记录时候的来源，默认为 ctx.params
  value?: { type: 'params' | 'body', valueKey: string };
}

const fieldsOptions = { fieldsFrom: rule => rule.fields || [] };
const defaultSearchOptions = {
  key: 'id',
  value: { type: 'params', valueKey: 'id' },
};

/**
 * @param modelName model 名称，可以是普通字符串，也可以是 casl 和 mongoose 的映射关系
 * @param errorType 返回错误类型，来自 GlobalErrorTypes
 * @param options 特殊配制选项，可以自定义 action 以及查询条件，详见上面的 IOptions 选项
 * return: function
 */
export default function checkPermission(modelName: string | ModelMapping, errorType: GlobalErrorTypes, options?: IOptions) {
  return function(_prototype, _key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      const that = this as Controller;
      // eslint-disable-next-line
      // @ts-ignore
      const { ctx } = that;
      // const { id } = ctx.params;
      const { method } = ctx.request;
      const searchOptions = assign(defaultSearchOptions, options || {});
      const { key, value } = searchOptions;
      const { type, valueKey } = value;

      // 构建 query
      const source = (type === 'params') ? ctx.params : ctx.request.body;
      const query = { [key]: source[valueKey] };
      // 构建 modelName
      const mongooseModelName = typeof modelName === 'string' ? modelName : modelName.mongoose;
      const caslModelName = typeof modelName === 'string' ? modelName : modelName.casl;
      const action = (options && options.action) ? options.action : caslMethodMapping[method];
      if (!ctx.state && !ctx.state.user) {
        return ctx.helper.error({ ctx, errorType });
      }
      let permission = false;
      let keyPermission = true;
      // 获取定义的 roles
      const ability = defineRoles(ctx.state.user);
      // 获取 rule 来判断是否存在对应的条件
      const rule = ability.relevantRuleFor(action, caslModelName);
      if (rule && rule.conditions) {
        const certainRecord = await ctx.model[mongooseModelName].findOne(query).lean();
        permission = ability.can(action, subject(caslModelName, certainRecord));
      } else {
        permission = ability.can(action, caslModelName);
      }
      // 判断 rule 中是否有对应的受限字段
      if (rule && rule.fields) {
        const fields = permittedFieldsOf(ability, action, caslModelName, fieldsOptions);
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
