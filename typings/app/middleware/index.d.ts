// This file is created by egg-ts-helper@1.34.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCustomError from '../../../app/middleware/customError';
import ExportDogLogger from '../../../app/middleware/dogLogger';
import ExportMyLogger from '../../../app/middleware/myLogger';

declare module 'egg' {
  interface IMiddleware {
    customError: typeof ExportCustomError;
    dogLogger: typeof ExportDogLogger;
    myLogger: typeof ExportMyLogger;
  }
}
