import { Application } from 'egg';
import { IBoot } from 'egg';
export default class AppBoot implements IBoot {
    private readonly app;
    constructor(app: Application);
    configWillLoad(): void;
    didReady(): Promise<void>;
}
