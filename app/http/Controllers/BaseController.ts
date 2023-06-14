import {CustomResponse} from "../Responses/CustomResponse";
import {response} from "express";
import {Request} from "../Requests/Request";

export class BaseController {
    protected response(...data: any) {
        let res = new CustomResponse()
        res.data = data;
        return res
    }
}