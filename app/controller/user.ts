import { Controller } from 'egg';
import { sign, verify } from 'jsonwebtoken';

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
    errno: 101003,
    message: '用户不存在或者密码错误'
  },
  loginValidateFail: {
    errno: 101004,
    message: '登录校验失败'
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
    const { ctx, service, app } = this;
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
    const token = sign({ username: user.username }, app.config.secret, { expiresIn: '1h' })
    ctx.helper.success({ ctx, res: { token }, msg: '登录成功' })
  }

  getTokenValue() {
    // JWT header 格式
    // Authorization: Bearer xxxx
    const { ctx } = this;
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

  async show() {
    const { ctx, app } = this
    const token = this.getTokenValue();
    if (!token) {
      return ctx.helper.error({ ctx, errorType: 'loginValidateFail' });
    }
    try {
      const decoded = verify(token, app.config.secret)
      return ctx.helper.success({ ctx, res: { decoded } })
    } catch (e) {
      return ctx.helper.error({ ctx, errorType: 'loginValidateFail' });
    }
  }
}
