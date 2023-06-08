import "reflect-metadata"
import {Server} from "./bin/startup";
import {AppBuilder} from "./app/app-builder";
import {AppContainer} from "./app/app-container";

AppContainer.configureContainers();

Server.setup(
    AppBuilder.getInstance().build()
).start()



