import {NextFunction, Request, Response} from "express";
import {injectable} from "inversify";
import {Get, Post} from "../../app";
import {CreateHomeRequest} from "../Requests/CreateHomeRequest";
import {Handle} from "../Requests/Decorators/Handle";
import {Controller} from "./Controller";
import {HttpStatusCode} from "axios";

export class HomeController extends Controller {

    @Get("/")
    public index(request: Request, response: Response) {
        response.send('respond with a resource');
    }

    @Post("/")
    @Handle(CreateHomeRequest)
    public create(request: CreateHomeRequest, response: Response) {
        response.status(HttpStatusCode.Ok).json(request.name);
    }
}