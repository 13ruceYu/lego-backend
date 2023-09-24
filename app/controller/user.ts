import { Controller } from 'egg';
import { sign } from 'jsonwebtoken';

const userCreateRules = {
  username: 'email',
  password: { type: 'password', min: 8 }
}

const sendCodeRules = {
  phoneNumber: {
    type: 'string',
    format: /^1[3-9]\d{9}$/,
    message: '手机号码格式有误'
  }
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
  },
  sendVeriCodeFrequentlyInfo: {
    errno: 101005,
    message: '请勿频繁获取短信验证码'
  }
}

export default class UserController extends Controller {
  validateUserInput(rules: any) {
    const { ctx, app } = this;
    const error = app.validator.validate(rules, ctx.request.body)
    return error
  }
  async createByEmail() {
    const { ctx, service } = this;
    const error = this.validateUserInput(userCreateRules)
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
    const error = this.validateUserInput(userCreateRules)
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
    const token = sign({ username: user.username }, app.config.jwt.secret, { expiresIn: '1h' })
    ctx.helper.success({ ctx, res: { token }, msg: '登录成功' })
  }

  async sendVeriCode() {
    const { ctx, app } = this;
    const { phoneNumber } = ctx.request.body
    const error = this.validateUserInput(sendCodeRules)
    if (error) {
      return ctx.helper.error({ ctx, errorType: 'userValidateFail', error })
    }
    // 获取 redis 的数据
    // phoneVeriCode-13233344445
    const preVeriCode = await app.redis.get(`phoneVeriCode-${phoneNumber}`)
    // 判断是否存在，存在说明已请求
    if (preVeriCode) {
      return ctx.helper.error({ ctx, errorType: 'sendVeriCodeFrequentlyInfo' })
    }
    // 不存在，创建验证码
    const veriCode = Math.floor((Math.random() * 9000 + 1000)).toString()
    await app.redis.set(`phoneVeriCode-${phoneNumber}`, veriCode, 'ex', 60)
    ctx.helper.success({ ctx, res: { veriCode } })
  }

  async getUserInfo() {
    const { ctx, service } = this
    const userData = await service.user.findByUsername(ctx.state.user.username);
    ctx.helper.success({ ctx, res: userData })
  }
}
