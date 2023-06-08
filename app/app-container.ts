import {Container, interfaces} from "inversify";
import {HomeController} from "./Http/Controllers/HomeController";
import express, {Express} from "express";
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

    public static create(): AppContainer {
        if (!AppContainer.instance) {
            AppContainer.instance = new AppContainer();
        }

        return AppContainer.instance;
    }

    public configureContainers() {
        this._container.bind(HomeController).to(HomeController).inTransientScope();
    }
}
