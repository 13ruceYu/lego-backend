import { verify } from 'jsonwebtoken';
import { Context, EggAppConfig } from 'egg';

function getTokenValue(ctx: Context) {
  // JWT header 格式
  // Authorization: Bearer token
  const { authorization } = ctx.header;
  // 没有 header 直接返回 false
  if (!ctx.header || !authorization) {
    return false;
  }
  if (typeof authorization === 'string') {
    const parts = authorization.trim().split(' ');
    if (parts.length === 2) {
      const scheme = parts[0];
      const credentials = parts[1];
      if (/^Bearer$/i.test(scheme)) {
        return credentials;
      }
    } else {
      return false;
    }
  }
}

export default (options: EggAppConfig['jwt']) => {
  return async (ctx: Context, next: () => Promise<any>) => {
  // 从 header 获取 token
    const token = getTokenValue(ctx);
    if (!token) {
      return ctx.helper.error({ ctx, errorType: 'loginValidateFail' });
    }
    // 判断 secret 是否存在
    const { secret } = options;
    if (!secret) {
      throw new Error('Secret not provided');
    }
    try {
      const decoded = verify(token, secret);
      ctx.state.user = decoded;
      await next();
    } catch (e) {
      return ctx.helper.error({ ctx, errorType: 'loginValidateFail' });
    }
  };

};
