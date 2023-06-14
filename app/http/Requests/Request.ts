import {Request as ExpressRequest} from "express";
import {classToClassFromExist, plainToClass, plainToClassFromExist, plainToInstance} from "class-transformer";
import {HttpStatusCode} from "axios";
import {validate} from "class-validator";

export class Request {
    private _expressRequest: ExpressRequest;

    constructor(expressRequest: ExpressRequest) {
        this._expressRequest = expressRequest;
    }

    get expressRequest(): ExpressRequest {
        return this._expressRequest;
    }

    public static async mapper<T extends typeof Request>(req: ExpressRequest, dtoClass: new (arg: any) => InstanceType<T>) {
        let requestPayload = await req.body;

        return classToClassFromExist(requestPayload, new dtoClass(req));
    }

    public static async validate<T extends typeof Request>(req: ExpressRequest, dtoClass: new (arg: any) => InstanceType<T>): Promise<string[]> {
        let request = await this.mapper(req, dtoClass);

        const errors = await validate(request as object);
        if (errors.length > 0) {
            return errors.map(error => Object.values(error.constraints!)).flat();
        }

        return [];
    }
}