import {ArrayMinSize, ArrayNotEmpty, IsString, Length} from "class-validator";
import {Request} from "./Request";
import {ApiRequest, Property} from "../ApiDocs/Decorators/ApiRequest";

@ApiRequest()
export class CreateHomeRequest extends Request {

    @IsString()
    @Length(5, 20)
    @Property()
    address: string;

    @IsString()
    @Length(5, 20)
    @Property()
    name: string;

    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @Property()
    siblings: string[];
}