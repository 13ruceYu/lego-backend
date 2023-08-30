import { Application } from 'egg'
import { Schema } from 'mongoose'
import AppBoot from '../../app'

function initUserModel(app: Application) {
  const UserSchema = new Schema({
    name: { type: String },
    age: { type: Number },
    hobbies: { type: Array },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
  }, { collection: 'user' })
  return app.mongoose.model('user', UserSchema)
}
export default initUserModel
