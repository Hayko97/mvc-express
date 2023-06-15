import {IsString, Length} from "class-validator";
import {Request} from "./Request";
import {Property} from "../ApiDocs/Decorators/ApiRequest";

export class CreateCarRequest extends Request {

    @IsString()
    @Length(1, 20)
    @Property()
    name: string;

    @IsString()
    @Length(5, 20)
    @Property()
    model: string;
}