import { Controller } from 'egg';

const userCreateRules = {
  username: 'email',
  password: { type: 'password', min: 8 }
}

export const userErrorMessage = {
  userValidateFail: {
    errno: 101001,
    message: '输入信息验证失败'
  },
  createUserAlreadyExists: {
    errno: 101002,
    message: '该邮箱已被注册，请直接登录'
  },
  loginCheckFailInfo: {
    errno: 1101003,
    message: '用户不存在或者密码错误'
  }
}

export default class UserController extends Controller {
  validateUserInput() {
    const { ctx, app } = this;
    const error = app.validator.validate(userCreateRules, ctx.request.body)
    return error
  }
  async createByEmail() {
    const { ctx, service } = this;
    const error = this.validateUserInput()
    if (error) {
      return ctx.helper.error({ ctx, errorType: 'userValidateFail', error })
    }
    const { username } = ctx.request.body
    const user = await service.user.findByUsername(username)
    if (user) {
      return ctx.helper.error({ ctx, errorType: 'createUserAlreadyExists' })
    }
    const userData = await service.user.createByEmail(ctx.request.body)
    ctx.helper.success({ ctx, res: userData })
  }

  async loginByEmail() {
    const { ctx, service } = this;
    const error = this.validateUserInput()
    if (error) {
      return ctx.helper.error({ ctx, errorType: 'userValidateFail', error })
    }
    // 根据 username 取得用户信息
    const { username, password } = ctx.request.body
    const user = await service.user.findByUsername(username)
    if (!user) {
      return ctx.helper.error({ ctx, errorType: 'loginCheckFailInfo' })
    }
    const isPwdCorrect = await ctx.compare(password, user.password)
    if (!isPwdCorrect) {
      return ctx.helper.error({ ctx, errorType: 'loginCheckFailInfo' })
    }
    ctx.helper.success({ ctx, res: user.toJSON(), msg: '登录成功' })
  }

  async show() {
    const { ctx, service } = this
    const userData = await service.user.findById(ctx.params.id)
    ctx.helper.success({ ctx, res: userData })
  }
}
