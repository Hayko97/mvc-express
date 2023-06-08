import {NextFunction, Request, Response} from "express";
import {injectable} from "inversify";
import {Get, Post} from "../../app";

@injectable()
export class HomeController {
    @Get("/")
    public index(request: Request, response: Response) {
        response.send('respond with a resource');
    }

    @Post("/")
    public create(request: Request, response: Response) {
        response.send(request.body);
    }
}