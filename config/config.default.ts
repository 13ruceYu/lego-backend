import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import 'dotenv/config';
import { join } from 'path';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;
  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1631677352881_6029';

  // add your egg config in here
  config.middleware = [ 'customError' ];

  config.security = {
    csrf: {
      enable: false,
    },
  };
  config.view = {
    defaultViewEngine: 'nunjucks',
  };
  config.logger = {
    consoleLevel: 'DEBUG',
  };
  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/lego',
  };
  config.bcrypt = {
    saltRound: 10,
  };
  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0,
    },
  };
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };
  config.multipart = {
    whitelist: [ '.png', '.jpg', '.gif', '.webp' ],
    fileSize: '500kb',
  };
  config.static = {
    dir: [
      { prefix: '/public', dir: join(appInfo.baseDir, 'app/public') },
      { prefix: '/uploads', dir: join(appInfo.baseDir, 'uploads') },
    ],
  };
  config.oss = {
    client: {
      accessKeyId: process.env.ALI_ACCESS_KEY || '',
      accessKeySecret: process.env.ALI_SECRET_KEY || '',
      bucket: 'lego-backend-vue',
      endpoint: 'oss-cn-hangzhou.aliyuncs.com',
    },
  };
  const giteeOAuthConfig = {
    cid: process.env.GITEE_CID,
    secret: process.env.GITEE_SECRET,
    redirectURL: 'http://localhost:7001/api/users/oauth/gitee/callback',
    authURL: 'https://gitee.com/oauth/token?grant_type=authorization_code',
  };
  const githubOAuthConfig = {
    cid: process.env.GITHUB_CID,
    secret: process.env.GITHUB_SECRET,
    redirectURL: 'http://localhost:7001/api/users/oauth/github/callback',
    authURL: 'https://github.com/login/oauth/access_token',
    githubUserApi: 'https://api.github.com/user',
  };
  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    myLogger: {
      allowedMethod: [ 'POST', 'GET' ],
    },
    baseUrl: 'default.url',
    jwt: {
      secret: process.env.JWT_SECRET,
    },
    giteeOAuthConfig,
    githubOAuthConfig,
    H5BaseURL: 'http://localhost:7001/api/pages',
  };

  // the return config will combines to EggAppConfig
  return {
    ...config as {},
    ...bizConfig,
  };
};
