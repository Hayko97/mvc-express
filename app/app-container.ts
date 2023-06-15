import {Container, interfaces} from "inversify";
import {HomeController} from "./http/Controllers/HomeController";
import express, {Express, NextFunction, Request, Response} from "express";
import {BaseController} from "./http/Controllers/BaseController";
import {CarController} from "./http/Controllers/CarController";
import {ILogger} from "./utils/Logging/ILogger";
import {Logger} from "./utils/Logging/Logger";
import {IDataSourceFactory} from "../database/IDataSourceFactory";
import {DataSourceFactory} from "../database/DataSourceFactory";


export class AppContainer {

    private readonly _container: Container;
    private static instance: AppContainer;

    private constructor() {
        this._container = new Container();
    }

    controllers: BaseController[] = [
        new HomeController(),
        new CarController(),
    ]

    public setupBindings() {
        this._container.bind<IDataSourceFactory>("IDataSourceFactory").to(DataSourceFactory).inSingletonScope()
        this._container.bind<ILogger>("ILogger").to(Logger).inTransientScope()
    }

    public static async create(): Promise<AppContainer> {
        if (!AppContainer.instance) {
            AppContainer.instance = new AppContainer();
        }

        return AppContainer.instance;
    }
}
