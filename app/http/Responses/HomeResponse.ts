import {CustomResponse} from "./CustomResponse";
import {ApiResponse, Property} from "../ApiDocs/Decorators/ApiResponse";

@ApiResponse()
export class HomeResponse extends CustomResponse {

    @Property()
    address: string;

    @Property()
    name: string;

    @Property()
    siblings: string[];

    //Override is required for returning this data from controller
    override get data(): any {
        return this.name;
    }
}