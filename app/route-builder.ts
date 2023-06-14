import {App} from "./app";
import express, {Request as ExpressRequest, Response as ExpressResponse, Express, NextFunction} from "express";
import {HttpStatusCode} from "axios";
import {CustomResponse} from "./http/Responses/CustomResponse";
import {Request} from "./http/Requests/Request"
import {DocumentBuilder} from "./http/ApiDocs/DocumentBuilder";
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

    public addRoute(path: string, router: core.Router, method: string) {

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