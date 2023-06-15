import {Request, Response} from "express";
import {BaseController} from "./BaseController";
import {Get, Post, Put} from "../../builders/route-decorators";
import {CreateCarRequest} from "../Requests/CreateCarRequest";
import {UpdateCarRequest} from "../Requests/UpdateCarRequest";
import {CustomResponse} from "../Responses/CustomResponse";

export class CarController extends BaseController {
    @Get("/car/:id")
    public index(id: number, request: Request): CustomResponse {
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