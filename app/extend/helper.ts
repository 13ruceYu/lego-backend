import { Context } from 'egg'
import { userErrorMessage } from '../controller/user'
import { workErrorMessages } from '../controller/work'

interface IRespType {
  ctx: Context;
  res?: any;
  msg?: string;
}

interface IErrorRespType {
  ctx: Context;
  errorType: keyof (typeof userErrorMessage & typeof workErrorMessages);
  error?: any;
}

const globalErrorMessages = {
  ...userErrorMessage,
  ...workErrorMessages
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
    const { message, errno } = globalErrorMessages[errorType]
    ctx.body = {
      errno,
      message,
      ...(error && { error })
    }
    ctx.status = 200
  }
}
