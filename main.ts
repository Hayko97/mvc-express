import "reflect-metadata"
import {Server} from "./server";
import {AppContainer} from "./app/app-container";

let container = AppContainer.create();

Server.setup(
    container.app
).start()



