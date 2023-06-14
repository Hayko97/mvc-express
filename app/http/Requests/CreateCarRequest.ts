import {IsString, Length} from "class-validator";
import {Request} from "./Request";
import {Init} from "../Decorators/properties";

export class CreateCarRequest extends Request {

    @IsString()
    @Length(1, 20)
    @Init()
    name: string;

    @IsString()
    @Length(5, 20)
    @Init()
    model: string;

}