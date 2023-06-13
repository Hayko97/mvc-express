import {HttpStatusCode} from "axios";
import {response, Response as ExpressResponse} from "express";
import {plainToClass, plainToInstance} from "class-transformer";

export class CustomResponse {

    private readonly _expressResponse: ExpressResponse
    private _statusCode: HttpStatusCode;
    private _data: any = {};

    constructor(expressResponse: ExpressResponse) {
        this._expressResponse = expressResponse
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
        let res = new CustomResponse(response)
        res.data = plainToInstance(
            Object.getPrototypeOf(dtoInstance).constructor,
            dtoInstance,
            {excludeExtraneousValues: true}
        );

        return res;
    }

    public static response(...data: any) {
        let res = new CustomResponse(response)
        res.data = data;
        return res;
    }
}