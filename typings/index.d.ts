import 'egg';
import { Connection, Model } from 'mongoose';

declare module 'egg' {
  interface MongooseModels extends IModel {
    [key: string]: Model<any>
  }
  interface Context {
    genHash(plainText: string): Promise<string>;
    compare(plainText: string, hash: string): Promise<boolean>
  }
  interface EggAppConfig {
    bcrypt: {
      saltRounds: number;
    }
  }
}