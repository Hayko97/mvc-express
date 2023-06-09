import {ArrayMinSize, ArrayNotEmpty, IsString, Length} from "class-validator";
import {Request} from "./Request";
import {Request as ExpressRequest} from "express";

export class CreateHomeRequest extends Request {

    @IsString()
    @Length(5, 20)
    address: string;

    @IsString()
    @Length(5, 20)
    name: string;

    @ArrayNotEmpty()
    @ArrayMinSize(1)
    siblings: string[];
}