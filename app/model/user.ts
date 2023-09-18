import { Application } from 'egg'
import { Schema } from 'mongoose'

export interface IUserProps {
  username: string;
  password: string;
  email: string;
  nickName: string;
  picture: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

function initUserModel(app: Application) {
  const UserSchema = new Schema<IUserProps>({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    nickName: String,
    picture: String,
    email: String,
    phoneNumber: String
  }, { timestamps: true })

  return app.mongoose.model<IUserProps>('User', UserSchema)
}

export default initUserModel
