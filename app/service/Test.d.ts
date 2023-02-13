import { Service } from 'egg';
/**
 * Test Service
 */
export default class Test extends Service {
    /**
     * sayHi to you
     * @param name - your name
     */
    sayHi(name: string): Promise<string>;
}
