import 'egg';
import { Connection, Model } from 'mongoose'
import * as OSS from 'ali-oss'

declare module 'egg' {
  interface MongooseModels extends IModel {
    [key: string]: Model<any>
  }

  interface Context {
    genHash(plaintext: string): Promise<string>;
    compare(plaintext: string, hash: string): Promise<boolean>,
    oss: OSS
  }

  interface EggAppConfig {
    bcrypt: {
      saltRound: number
    },
    oss: {
      client?: OSS.Options
    }
  }
}