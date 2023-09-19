import 'egg';
import { Connection, Model } from 'mongoose'

declare module 'egg' {
  interface MongooseModels extends IModel {
    [key: string]: Model<any>
  }
}