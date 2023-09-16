import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks'
  },
  mongoose: {
    enable: true,
    package: 'egg-mongoose'
  }
};

export default plugin;
