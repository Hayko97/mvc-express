import {NextFunction, Request, Response} from "express";
import {injectable} from "inversify";
import {CreateHomeRequest} from "../Requests/CreateHomeRequest";
import {BaseController} from "./BaseController";
import {HttpStatusCode} from "axios";
import {Delete, Get, Post, Put} from "../Decorators/routes";
import {CreateCarRequest} from "../Requests/CreateCarRequest";
import {UpdateCarRequest} from "../Requests/UpdateCarRequest";
import {CustomResponse} from "../Responses/CustomResponse";

export class CarController extends BaseController {

    @Get("/car/:id")
    public index(id: string, request: Request): CustomResponse {
        return this.response("hello - " + id)
    }

    @Post("/car", CreateCarRequest)
    public create(request: CreateCarRequest): CustomResponse {
        return this.response(request.name);
    }

    @Put("/car/:id", UpdateCarRequest)
    public update(id: string, request: UpdateCarRequest): CustomResponse {
        return this.response(request.name, id);
    }
}