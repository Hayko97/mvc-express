import {Request as ExpressRequest} from "express";

export class Request {
    private _expressRequest: ExpressRequest;

    constructor(expressRequest: ExpressRequest) {
        this._expressRequest = expressRequest;
    }

    get expressRequest(): ExpressRequest {
        return this._expressRequest;
    }
}