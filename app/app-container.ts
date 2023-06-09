import {Container, interfaces} from "inversify";
import {HomeController} from "./http/Controllers/HomeController";
import express, {Express} from "express";
import {Auth} from "./http/Middleware/Auth";
import {Cors} from "./http/Middleware/Cors";
import {Middleware} from "./http/Middleware/Middleware";
import {getApp} from "./app";

export class AppContainer {

    private readonly _container;
    private static instance: AppContainer;

    private constructor() {
        this._container = new Container();
    }

    get app(): Express {
        return getApp();
    }

    public static getInstance(): AppContainer {
        if (!AppContainer.instance) {
            AppContainer.instance = new AppContainer();
        }

        return AppContainer.instance;
    }

    public bindControllers() {
        this._container.bind(HomeController).to(HomeController).inTransientScope();

        return this;
    }
}
