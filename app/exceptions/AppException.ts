import {HttpStatusCode} from "axios";

export class AppException extends Error {
    protected statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }

    get StatusCode(): number {
        return this.statusCode
    }
}