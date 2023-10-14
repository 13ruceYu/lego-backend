import { Controller } from 'egg';
import { GlobalErrorTypes } from '../error';

export default function checkPermission(modelName: string, errorType: GlobalErrorTypes, userKey = 'user') {
  return function(prototype, key: string, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value;
    descriptor.value = async function(args) {
      const that = this as Controller;
      // eslint-disable-next-line
      // @ts-ignore
      const { ctx } = that;
      const { id } = ctx.params;
      const { userId } = ctx.state.user._id;
      const certainRecord = await ctx.model[modelName].findOne({ id });
      if (!certainRecord || certainRecord[userKey].toString() !== userId) {
        return ctx.helper.error({ ctx, errorType });
      }
      await originMethod.apply(this, args);
    };
  };
}
