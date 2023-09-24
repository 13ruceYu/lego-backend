import { verify } from 'jsonwebtoken';
import { Context, EggAppConfig } from 'egg';

function getTokenValue(ctx: Context) {
  // JWT header 格式
  // Authorization: Bearer xxxx
  const { authorization } = ctx.header;
  if (!ctx.header || !authorization) {
    return false
  }
  if (typeof authorization === 'string') {
    const parts = authorization.trim().split(' ');
    if (parts.length === 2) {
      const [ schema, credential ] = parts;
      return (schema === 'Bearer' ? credential : false);
    }
  } else {
    return false;
  }
}

export default (options: EggAppConfig['jwt']) => {
  return async (ctx: Context, next: () => Promise<any>) => {
    const token = getTokenValue(ctx);
    if (!token) {
      return ctx.helper.error({ ctx, errorType: 'loginValidateFail' })
    }
    const { secret } = options
    if (!secret) {
      throw new Error('jwt secret not provided')
    }
    try {
      const decoded = verify(token, secret);
      ctx.state.user = decoded;
      await next()
    } catch (e) {
      return ctx.helper.error({ ctx, errorType: 'loginValidateFail' })
    }
  }
}
