import {ArrayMinSize, ArrayNotEmpty, IsString, Length} from "class-validator";
import {Init} from "../Decorators/properties";
import {Request} from "./Request";
import {ApiRequest, Item} from "../ApiDocs/Decorators/ApiRequest";

@ApiRequest()
export class CreateHomeRequest extends Request {

    @IsString()
    @Length(5, 20)
    @Item()
    address: string;

    @IsString()
    @Length(5, 20)
    @Item()
    name: string;

    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @Item()
    siblings: string[];
}