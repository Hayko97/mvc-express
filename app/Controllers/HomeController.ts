import {NextFunction, Request, Response} from "express";
import {get} from "../router";
import {injectable} from "inversify";

@injectable()
export class HomeController {
    @get("/")
    public index(request: Request, response: Response) {
        response.send('respond with a resource');
    }
}
