import {HttpStatusCode} from "axios";
import {response, Response as ExpressResponse} from "express";
import {plainToClass, plainToClassFromExist, plainToInstance} from "class-transformer";

export class CustomResponse {

    private readonly _expressResponse: ExpressResponse
    private _statusCode: HttpStatusCode;
    private _data: any = {};

    constructor() {
        this._expressResponse = response
    }

    get expressResponse(): ExpressResponse {
        return this._expressResponse;
    }

    get data(): any {
        return this._data
    }

    set data(data: any) {
        this._data = data
    }

    public setStatus(value: HttpStatusCode): CustomResponse {
        this._statusCode = value;
        return this;
    }

    public getStatus(): HttpStatusCode {
        return this._statusCode;
    }

    public static fromDto<T>(dtoInstance: T): any {
        let res = new CustomResponse()
        res.data = plainToClassFromExist(
            Object.getPrototypeOf(dtoInstance).constructor,
            dtoInstance,
            {excludeExtraneousValues: true}
        );

        return res;
    }
}