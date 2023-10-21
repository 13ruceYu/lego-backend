import { Application } from 'egg';
import { Schema, ObjectId } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

export interface IWorkProps {
  id?: string;
  uuid: string;
  title: string;
  desc: string;
  coverImg?: string;
  content?: { [key: string]: any };
  isTemplate?: boolean;
  isPublic?: boolean;
  isHot?: boolean;
  author: string;
  copiedCount: number;
  status?: 0 | 1 | 2;
  user: ObjectId;
  latestPublishAt?: Date;
}

function initWorkModel(app: Application) {
  const AutoIncrement = AutoIncrementFactory(app.mongoose);
  const WorkSchema = new Schema<IWorkProps>({
    uuid: { type: String, unique: true },
    title: String,
    desc: String,
    coverImg: String,
    content: Object,
    isTemplate: Boolean,
    isPublic: Boolean,
    isHot: Boolean,
    author: String,
    copiedCount: { type: Number, default: 0 },
    status: { type: Number, default: 1 },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    latestPublishAt: { type: Date },
  }, {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
    },
  });
  WorkSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'works_id_counter' });
  return app.mongoose.model<IWorkProps>('Work', WorkSchema);
}

export default initWorkModel;
