import { Schema } from 'mongoose';
import { Application } from 'egg';

export interface UserProps {
  username: string;
  password: string;
  email?: string;
  nickName?: string;
  picture?: string;
  phoneNumber?: string;
  createAt: Date;
  updateAt: Date;
}

function initUserModel(app:Application) {
  const UserSchema = new Schema<UserProps>({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String },
    picture: { type: String },
    nickName: { type: String },
    phoneNumber: { type: String },
  }, { timestamps: true });

  return app.mongoose.model<UserProps>('User', UserSchema);
}

export default initUserModel;
