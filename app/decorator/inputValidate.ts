import { Controller } from 'egg';
import { GlobalErrorTypes } from './../error/index';

export default function validateInput(rules: any, errorType: GlobalErrorTypes) {
  return function(prototype, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: any[]) {
      const that = this as Controller;
      // eslint-disable-next-line
      // @ts-ignore
      const { ctx, app } = that;
      const errors = app.validator.validate(rules, ctx.request.body);
      if (errors) {
        return ctx.helper.error({ ctx, error: errors, errorType });
      }
      return originalMethod.apply(this, args);
    };
  };
}
