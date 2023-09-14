import 'egg';
import { Connection, Model } from 'mongoose'

declare module 'egg' {
  type MongooseModels = {
    [key: string]: Model<any>
  }
  interface Application {
    mongoose: Connection;
    model: MongooseModels
  }
}