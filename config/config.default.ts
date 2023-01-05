import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1671114951190_7890';

  // add your egg config in here
  config.middleware = [ 'myLogger' ];

  config.security = {
    csrf: {
      enabled: false,
    },
  };

  config.view = {
    defaultViewEngine: 'nunjucks',
  };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    baseUrl: 'base.url',
    myLogger: {
      allowedMethod: [ 'POST' ],
    },
  };

  // the return config will combines to EggAppConfig
  return {
    ...config as {},
    ...bizConfig,
  };
};
