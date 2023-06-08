import express, {Express} from "express";
import {AppBuilder} from "./app-builder";

var _app: Express = express();

_app = new AppBuilder(_app).build();

export function getApp() {
    return _app
}

//Route decorators
/*
Issue related division by classes,
decorator functions calls first, while the app doesn't initialized and middlewares doesn't setups
*/
export function Get(path: string) {
    console.log("decorator");
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        _app.get(path, descriptor.value);
    };
}

export function Post(path: string) {
    console.log("decorator");
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        _app.post(path, descriptor.value);
    };
}

export function Put(path: string) {
    console.log("decorator");
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        _app.put(path, descriptor.value);
    };
}

export function Delete(path: string) {
    console.log("decorator");
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
