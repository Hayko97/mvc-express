import "reflect-metadata"
import {Server} from "./server";
import {AppContainer} from "./app/app-container";
import {App} from "./app/app";
import dotenv from "dotenv";
import {HomeController} from "./app/http/Controllers/HomeController";
import {CreateHomeRequest} from "./app/http/Requests/CreateHomeRequest";

dotenv.config();
let app = App.getInstance();
AppContainer.create().then((container: AppContainer) => {
    container.setupBindings();
    Server.setup(app.getApp()).start();
});

