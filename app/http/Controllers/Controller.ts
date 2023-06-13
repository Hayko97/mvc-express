import {CustomResponse} from "../Responses/CustomResponse";
import {response} from "express";

export class Controller {
    protected response(...data: any) {
        let res = new CustomResponse(response)
        res.data = data;
        return res
    }
}