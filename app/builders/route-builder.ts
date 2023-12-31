import express, {Request as ExpressRequest, Response as ExpressResponse, Express, NextFunction} from "express";
import * as core from "express-serve-static-core";
import {string} from "yargs";

export class RouteBuilder {
    private static instance: RouteBuilder;
    private readonly _handlers: { path: string, router: core.Router, method: string }[] = [];

    public static getInstance(): RouteBuilder {
        if (!RouteBuilder.instance) {
            RouteBuilder.instance = new RouteBuilder();
        }

        return RouteBuilder.instance;
    }

    public addRoute(path: string, method: string, handler: any) {

        let router: core.Router = express.Router();
        router.get(path, handler)

        this._handlers.push({
            path: path,
            router: router,
            method: method
        });
    }

    public build(app: Express) {
        this._handlers.forEach((handler) => {
            switch (handler.method) {
                case "get":
                    app.get(handler.path, handler.router)
                    break;
                case "post":
                    app.post(handler.path, handler.router)
                    break;
                case "put":
                    app.put(handler.path, handler.router)
                    break;
                case "delete":
                    app.delete(handler.path, handler.router)
                    break;
                case "patch":
                    app.patch(handler.path, handler.router)
                    break;
            }
        });
    }
}