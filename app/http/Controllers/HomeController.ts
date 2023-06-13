import {NextFunction, Request, Response as ExpressResponse} from "express";
import {CustomResponse} from "../Responses/CustomResponse";
import {injectable} from "inversify";

import {CreateHomeRequest} from "../Requests/CreateHomeRequest";
import {Handle} from "../Requests/Decorators/Handle";
import {Controller} from "./Controller";
import {Get, Post} from "../../router";

export class HomeController extends Controller {

    constructor() {
        super();
    }

    @Get("/")
    public index(request: Request): CustomResponse {

        return this.response("helo");
    }

    @Post("/create/:id", CreateHomeRequest)
    public create(id: number, request: CreateHomeRequest): CustomResponse {

        return CustomResponse.response(request.name, id);
    }
}