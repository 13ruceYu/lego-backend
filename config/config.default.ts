import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;
  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1631677352881_6029';

  // add your egg config in here
  config.middleware = [ ];

  config.security = {
    csrf: {
      enable: false
    }
  }
  config.view = {
    defaultViewEngine: 'nunjucks'
  }
  config.logger = {
    consoleLevel: 'DEBUG'
  }
  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    myLogger: {
      allowedMethod: [ 'POST', 'GET' ]
    },
    baseUrl: 'default.url',
    mongoose: {
      url: 'mongodb://127.0.0.1:27017/hello',
      options: {},
      // mongoose global plugins, expected a function or an array of function and options
      // plugins: [ createdPlugin, [ updatedPlugin, pluginOptions ]],
    }
  };

  // the return config will combines to EggAppConfig
  return {
    ...config as {},
    ...bizConfig,
  };
};
