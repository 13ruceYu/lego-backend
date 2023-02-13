import { Controller } from 'egg';
export default class TestController extends Controller {
    index(): Promise<void>;
    getDog(): Promise<void>;
}
