import {CustomResponse} from "./CustomResponse";

export class HomeResponse extends CustomResponse {

    address: string;

    name: string;

    siblings: string[];

    //Override is required for returning this data from controller
    override get data(): any {
        return CustomResponse.fromDto(HomeResponse /*Can pass any dto*/);
    }
}