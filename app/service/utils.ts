import { renderToString } from '@vue/server-renderer';
import { Service } from 'egg';
import { createSSRApp } from 'vue';
import LegoComponent from 'lego-components';

export default class UserService extends Service {
  async renderToPageData(query: { id: number, uuid: string }) {
    const work = await this.ctx.model.Work.findOne(query).lean();
    if (!work) {
      throw new Error('work not exist');
    }
    const { title, desc, content } = work;
    const vueApp = createSSRApp({
      data: () => ({
        components: (content && content.components) || [],
      }),
      template: '<final-page :components="components"></final-page>',
    });
    vueApp.use(LegoComponent);
    const html = await renderToString(vueApp);
    return {
      html,
      title,
      desc,
    };
  }
}
