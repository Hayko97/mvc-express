import {ArrayMinSize, ArrayNotEmpty, IsString, Length} from "class-validator";
import {Request} from "./Request";

export class UpdateCarRequest extends Request {

    @IsString()
    @Length(1, 20)
    name: string;

    @IsString()
    @Length(5, 20)
    model: string;
}