import {Middleware} from "./Middleware";
import {NextFunction, Request, Response} from "express";
import {injectable} from "inversify";

@injectable()
export class Cors extends Middleware {
    handle(req: Request, res: Response, next: NextFunction): void {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "*");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Handle-Method, Access-Control-Handle-Headers,Authorization");
        next();
    }
}