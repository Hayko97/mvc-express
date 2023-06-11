import {NextFunction, Request, Response} from "express";
import {injectable} from "inversify";
import {CreateHomeRequest} from "../Requests/CreateHomeRequest";
import {Handle} from "../Requests/Decorators/Handle";
import {Controller} from "./Controller";
import {HttpStatusCode} from "axios";
import {Get, Post} from "../../router";
import {CreateCarRequest} from "../Requests/CreateCarRequest";

export class CarController extends Controller {

    @Get("/car")
    public index(request: Request, response: Response) {
        response.send('respond with a resource');
    }

    @Post("/car")
    @Handle(CreateCarRequest)
    public create(request: CreateCarRequest, response: Response) {
        response.status(HttpStatusCode.Ok).json(request.name);
    }
}