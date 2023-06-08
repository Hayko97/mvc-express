import {Container} from "inversify";
import {HomeController} from "./Controllers/HomeController";

export class AppContainer {

    private static _container = new Container();

    public static configureContainers() {
        this._container.bind(HomeController).to(HomeController).inTransientScope();
    }
}
