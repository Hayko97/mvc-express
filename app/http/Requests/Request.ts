import {Request as ExpressRequest} from "express";
import {classToClassFromExist} from "class-transformer";
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

    public static async validate<T>(req: ExpressRequest, customRequest: Request): Promise<string[]> {
        var requestPayload = await req.body;
        req = classToClassFromExist(requestPayload, customRequest);

        const errors = await validate(req);

        if (errors.length > 0) {
            return errors.map(error => Object.values(error.constraints!)).flat();
        }

        return [];
    }
}