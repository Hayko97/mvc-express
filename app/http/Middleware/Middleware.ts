import {NextFunction, Request, Response} from "express";
import {AppContainer} from "../../app-container";
import {App} from "../../app";

export abstract class Middleware {
    constructor() {
        App.getInstance().getApp().use(this.handle)
    }

    abstract handle(req: Request, res: Response, next: NextFunction): void;
}