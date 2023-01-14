import { Schema } from 'mongoose';
import { Application } from 'egg';

export default function(app: Application) {
  const UserSchema = new Schema({
    name: { type: String },
    age: { type: Number },
    hobbies: { type: Array },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
  }, { collection: 'user' });

  return app.mongoose.model('user', UserSchema);
}
