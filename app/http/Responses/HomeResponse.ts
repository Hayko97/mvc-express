import {CustomResponse} from "./CustomResponse";
import {Init} from "../Decorators/properties";
import {classToPlain} from "class-transformer";

export class HomeResponse extends CustomResponse {

    @Init()
    address: string;

    @Init()
    name: string;

    @Init()
    siblings: string[];

    //Override is required for returning this data from controller
    override get data(): any {
        return this.name;
    }
}