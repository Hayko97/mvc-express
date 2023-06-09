import {Middleware} from "./Middleware";
import {NextFunction, Request, Response} from "express";
import {injectable} from "inversify";

@injectable()
export class Auth extends Middleware {
    handle(req: Request, res: Response, next: NextFunction): void {

    }
}