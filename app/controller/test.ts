import { Controller } from 'egg';

export default class TestController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hello test';
    ctx.status = 200;
  }
  async getDog() {
    const { service, ctx } = this;
    const resp = await service.dog.show();
    console.log(resp);
    ctx.body = resp.message;
    ctx.status = 200;
  }
}
