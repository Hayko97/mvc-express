import "reflect-metadata"
import {Server} from "./server";
import {AppContainer} from "./app/app-container";
import {App} from "./app/app";
import dotenv from "dotenv";

console.info("Application Building")
let app = App.getInstance();
AppContainer.create().then((container: AppContainer) => {
    container.setupBindings();
    app.builder.errorHandlers();

    Server.setup(app.getApp()).start();
});