import express, {Express, NextFunction, Request, RequestHandler, Response, Router} from "express";
import {AppBuilder} from "./app-builder";
import {HttpStatusCode} from "axios/index";
import {AppException} from "./exceptions/AppException";

var _app: Express = express();

export function getApp() {
    return _app
}

new AppBuilder(_app).build();

//Route decorators
/*
Issue related division by classes,
decorator functions calls first, while the app-container doesn't initialized and middlewares doesn't setups
*/
export function Get(path: string) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        _app.get(path, descriptor.value);
    };
}

export function Post(path: string) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        _app.post(path, descriptor.value);
    };
}

export function Put(path: string) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        _app.put(path, descriptor.value);
    };
}

export function Delete(path: string) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        _app.delete(path, descriptor.value);
    };
}

export function Patch(path: string) {
    console.log("decorator");
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        _app.patch(path, descriptor.value);
    };
}

export function logRequestHierarchy(app: Express, router: Router, prefix = '') {

    (app._router.stack as any[]).forEach((layer) => {
        if (layer.route) {
            const path = prefix + (layer.route?.path ?? '');
            const methods = Object.keys(layer.route?.methods ?? {}).join(', ');
            console.log(`Path: ${path}`);
            console.log(`Methods: ${methods}`);
            console.log('--- Middleware Stack ---');
            layer.route.stack.forEach((handler: RequestHandler) => {
                console.log(handler);
            });
            console.log('--- End of Middleware Stack ---');
        } else if (layer.name === 'router') {
            const router = layer.handle as Router;
            const routerPath = prefix + layer.path;
            console.log(`Router Path: ${routerPath}`);
            console.log('--- Router Stack ---');
            logRequestHierarchy(app, router, routerPath);
            console.log('--- End of Router Stack ---');
        } else if (layer.name === 'bound dispatch') {
            console.log('--- Middleware Stack ---');
            console.log(layer.handle);
            console.log('--- End of Middleware Stack ---');
        }
    });
}