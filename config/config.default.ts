import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1671114951190_7890';

  config.logger = {
    level: 'DEBUG',
  };

  // add your egg config in here
  // config.middleware = [ 'customError' ]; move to app.ts

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.view = {
    defaultViewEngine: 'nunjucks',
  };

  config.mongoose = {
    url: 'mongodb://localhost:27017/lego',
  };

  config.bcrypt = {
    saltRounds: 10,
  };

  config.jwt = {
    secret: process.env.JWT_SECRET || '',
    enable: true,
    match: [ '/api/users/getUserInfo', '/api/works', '/api/utils/upload-img', '/api/channel' ],
  };

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0,
    },
  };

  config.multipart = {
    whitelist: [ '.png', '.jpg', '.gif', '.webp' ],
    fileSize: '100kb',
  };

  config.static = {
    dir: [
      { prefix: '/public', dir: join(appInfo.baseDir, 'app/public') },
      { prefix: '/uploads', dir: join(appInfo.baseDir, 'uploads') },
    ],
  };

  config.oss = {
    client: {
      accessKeyId: process.env.ALC_ACCESS_KEY || '',
      accessKeySecret: process.env.ALC_SECRET_KEY || '',
      bucket: 'lego-backend-vue',
      endpoint: 'oss-cn-hangzhou.aliyuncs.com',
    },
  };

  // const aliCloudConfig = {
  //   accessKeyId: process.env.ALC_ACCESS_KEY,
  //   accessKeySecret: process.env.ALC_SECRET_KEY,
  //   endpoint: 'dysmsapi.aliyuncs.com',
  // };

  // gitee oauth config
  const giteeOauthConfig = {
    cid: process.env.GITEE_CID,
    secret: process.env.GITEE_SECRET,
    redirectURL: 'http://localhost:7001/api/users/passport/gitee/callback',
    authURL: 'https://gitee.com/oauth/token?grant_type=authorization_code',
    giteeUserApi: 'https://gitee.com/api/v5/user',
  };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    baseUrl: 'base.url',
    // aliCloudConfig,
    giteeOauthConfig,
    H5BaseURL: 'http://localhost:7001/api/pages',
    // myLogger: {
    //   allowedMethod: [ 'POST' ],
    // },
  };

  // the return config will combines to EggAppConfig
  return {
    ...config as {},
    ...bizConfig,
  };
};
