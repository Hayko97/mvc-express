import {App} from "./app";
import express from "express";

export function Get(path: string) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        let router = express.Router();
        router.get(path, descriptor.value)
        App.getInstance().getApp().get(path, router);
    };
}

export function Post(path: string) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        let router = express.Router();
        router.post(path, descriptor.value)
        App.getInstance().getApp().post(path, descriptor.value);
    };
}

export function Put(path: string) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        let router = express.Router();
        router.put(path, descriptor.value)
        App.getInstance().getApp().put(path, descriptor.value);
    };
}

export function Delete(path: string) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        let router = express.Router();
        router.delete(path, descriptor.value)
        App.getInstance().getApp().delete(path, descriptor.value);
    };
}

export function Patch(path: string) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        let router = express.Router();
        router.patch(path, descriptor.value)
        App.getInstance().getApp().patch(path, descriptor.value);
    };
}