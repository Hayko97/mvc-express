import {App} from "./app";
import express, {Request as ExpressRequest, Response as ExpressResponse, Express, NextFunction} from "express";
import {classToClassFromExist} from "class-transformer";
import {validate} from "class-validator";
import {HttpStatusCode} from "axios";
import {CustomResponse} from "./http/Responses/CustomResponse";
import {Request} from "./http/Requests/Request"

export function Get<T extends typeof Request>(path: string, dtoClass?: new (arg: any) => InstanceType<T>) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        descriptor.value = getNewDescriptor(target, path, descriptor, dtoClass)
        descriptor.value = descriptor.value.bind(target)

        let router = express.Router();
        router.get(path, descriptor.value)
        App.getInstance().getApp().get(path, router);

        return descriptor;
    };
}

export function Post<T extends typeof Request>(path: string, dtoClass?: new (arg: any) => InstanceType<T>) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        descriptor.value = getNewDescriptor(target, path, descriptor, dtoClass)
        descriptor.value = descriptor.value.bind(target)

        let router = express.Router();
        router.post(path, descriptor.value)
        App.getInstance().getApp().post(path, router);
    };
}

export function Put<T extends typeof Request>(path: string, dtoClass?: new (arg: any) => InstanceType<T>) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        descriptor.value = getNewDescriptor(target, path, descriptor, dtoClass)
        descriptor.value = descriptor.value.bind(target)


        let router = express.Router();
        router.put(path, descriptor.value)
        App.getInstance().getApp().put(path, router);
    };
}

export function Delete<T extends typeof Request>(path: string, dtoClass?: new (arg: any) => InstanceType<T>) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        descriptor.value = getNewDescriptor(target, path, descriptor, dtoClass)
        descriptor.value = descriptor.value.bind(target)

        let router = express.Router();
        router.delete(path, descriptor.value)
        App.getInstance().getApp().delete(path, router);
    };
}

export function Patch<T extends typeof Request>(path: string, dtoClass?: new (arg: any) => InstanceType<T>) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        descriptor.value = getNewDescriptor(target, path, descriptor, dtoClass)
        descriptor.value = descriptor.value.bind(target)

        let router = express.Router();
        router.patch(path, descriptor.value)
        App.getInstance().getApp().patch(path, router);
    };
}

function getNewDescriptor<T extends typeof Request>(
    target: any,
    path: string,
    descriptor: PropertyDescriptor,
    dtoClass?: new (arg: any) => InstanceType<T>
) {
    const originalMethod = descriptor.value;
    const paramNames: string[] = extractRouteParams(path);

    descriptor.value = async function (req: ExpressRequest, res: ExpressResponse, next: NextFunction) {

        let args: any[] = [];
        paramNames.forEach((paramName: string, index: number) => {
            console.log(req.params[paramName])
            args.push(req.params[paramName])
        });

        if (dtoClass != null) {
            let customRequest = new dtoClass(req)
            let errorMessage = await Request.validate(await req.body, customRequest)

            if (errorMessage.length > 0) {
                res.status(HttpStatusCode.UnprocessableEntity).json({errors: errorMessage});

                return;
            }
        }

        let response;

        if (args.length != 0) {
            response = originalMethod.call(this, args, req) as CustomResponse;
        } else {
            response = originalMethod.call(this, req) as CustomResponse;
        }

        res.json(response.data)
    };

    return descriptor.value;
}

function extractRouteParams(route: string): string[] {
    const paramRegex = /\/:(\w+)/g;
    const params: string[] = [];
    let match;

    while ((match = paramRegex.exec(route)) !== null) {
        params.push(match[1]);
    }

    return params;
}
