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
  },
  loginVeriCodeIncorrectFailInfo: {
    errno: 101006,
    message: '验证码不正确'
  },
  githubOauthError: {
    errno: 101007,
    message: 'Github 授权出错'
  }
}
