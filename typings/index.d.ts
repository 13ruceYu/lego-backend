import 'egg';
import { Connection, Model } from 'mongoose'

declare module 'egg' {
  interface MongooseModels extends IModel {
    [key: string]: Model<any>
  }

  interface Context {
    genHash(plaintext: string): Promise<string>;
    compare(plaintext: string, hash: string): Promise<boolean>
  }

  interface EggAppConfig {
    bcrypt: {
      saltRound: number
    }
  }
}