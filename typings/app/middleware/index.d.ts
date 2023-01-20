// This file is created by egg-ts-helper@1.34.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportDogLogger from '../../../app/middleware/dogLogger';
import ExportJwt from '../../../app/middleware/jwt';
import ExportMyLogger from '../../../app/middleware/myLogger';

declare module 'egg' {
  interface IMiddleware {
    dogLogger: typeof ExportDogLogger;
    jwt: typeof ExportJwt;
    myLogger: typeof ExportMyLogger;
  }
}
