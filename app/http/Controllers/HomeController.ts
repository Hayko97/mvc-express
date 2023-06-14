import {CreateHomeRequest} from "../Requests/CreateHomeRequest";
import {BaseController} from "./BaseController";
import {Controller, Get, Post} from "../Decorators/routes";
import {HomeResponse} from "../Responses/HomeResponse";

@Controller("Home", "Simple Home controller")
export class HomeController extends BaseController {
    // @Get("/api")
    // public index(request: Request): CustomResponse {
    //     return this.response("helo");
    // }

    @Post(
        "/api",
        CreateHomeRequest,
        "Simple Post Method"
    )
    public createApi(request: CreateHomeRequest): HomeResponse {
        let response = new HomeResponse()
        response.name = request.name;
        response.address = request.address;
        response.siblings = request.siblings;

        return response;
    }
}