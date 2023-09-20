import { Context } from 'egg'

interface IRespType {
  ctx: Context;
  res?: any;
  msg?: string;
}

interface IErrorRespType {
  ctx: Context;
  errno: number;
  msg?: string;
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
  error({ ctx, msg, errno }: IErrorRespType) {
    ctx.body = {
      errno,
      message: msg ? msg : '请求错误'
    }
    ctx.status = 200
  }
}
