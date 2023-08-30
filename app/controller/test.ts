import { Controller } from 'egg'

export default class TestController extends Controller {
  async index() {
    const { ctx } = this
    const { id } = ctx.params
    const { query, body } = ctx.request
    const { baseUrl } = ctx.app.config
    const persons = await ctx.service.dog.showPlayers()
    console.log('result', persons)
    const resp = {
      query,
      id,
      body,
      baseUrl,
      persons,
      mongooseId: ctx.app.mongoose.id
    }
    ctx.helper.success({ ctx, res: resp })
  }
  async getDog() {
    const { service, ctx } = this
    const resp = await service.dog.show()
    await ctx.render('test.nj', { url: resp.message })
  }
}
