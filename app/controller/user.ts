import { Controller } from 'egg';

const userCreateRules = {
  username: 'email',
  password: { type: 'password', min: 8 }
}

export const userErrorMessage = {
  createUserValidateFail: {
    errno: 101001,
    message: '创建用户验证失败'
  },
  createUserAlreadyExists: {
    errno: 101002,
    message: '该邮箱已被注册，请直接登录'
  }
}

export default class UserController extends Controller {
  async createByEmail() {
    const { ctx, service, app } = this;
    // ctx.validate(userCreateRules)
    const errors = app.validator.validate(userCreateRules, ctx.request.body)
    if (errors) {
      return ctx.helper.error({ ctx, errorType: 'createUserValidateFail', error: errors })
    }
    const { username } = ctx.request.body
    const user = ctx.service.user.findByUsername(username)
    if (user) {
      return ctx.helper.error({ ctx, errorType: 'createUserAlreadyExists' })
    }
    const userData = await service.user.createByEmail(ctx.request.body)
    ctx.helper.success({ ctx, res: userData })
  }

  async show() {
    const { ctx, service } = this
    const userData = await service.user.findById(ctx.params.id)
    ctx.helper.success({ ctx, res: userData })
  }
}
