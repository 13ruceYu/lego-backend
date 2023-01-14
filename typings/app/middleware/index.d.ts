// This file is created by egg-ts-helper@1.34.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportDogLogger from '../../../app/middleware/dogLogger';
import ExportMyLogger from '../../../app/middleware/myLogger';

declare module 'egg' {
  interface IMiddleware {
    dogLogger: typeof ExportDogLogger;
    myLogger: typeof ExportMyLogger;
  }
}
