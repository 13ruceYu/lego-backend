import { Context } from 'egg'
import { userErrorMessage } from '../controller/user'

interface IRespType {
  ctx: Context;
  res?: any;
  msg?: string;
}

interface IErrorRespType {
  ctx: Context;
  errorType: keyof (typeof userErrorMessage);
  error?: any;
}

export default {
  success({ ctx, res, msg }: IRespType) {
    ctx.body = {
      errno: 0,
      data: res ? res : null,
      message: msg ? msg : '请求成功'
    }
    ctx.status = 200
  },
  error({ ctx, error, errorType }: IErrorRespType) {
    const { message, errno } = userErrorMessage[errorType]
    ctx.body = {
      errno,
      message,
      ...(error && { error })
    }
    ctx.status = 200
  }
}
