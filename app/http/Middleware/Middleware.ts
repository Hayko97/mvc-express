import {NextFunction, Request, Response} from "express";
import {AppContainer} from "../../app-container";
import {getApp} from "../../app";

export abstract class Middleware {
    constructor() {
        getApp().use(this.handle)
    }

    abstract handle(req: Request, res: Response, next: NextFunction): void;
}