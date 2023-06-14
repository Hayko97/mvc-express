import {Request} from "../Requests/Request";
import {string} from "yargs";
import {DocumentBuilder} from "../ApiDocs/DocumentBuilder";
import * as core from "express-serve-static-core";
import express, {NextFunction, request, Request as ExpressRequest, Response as ExpressResponse} from "express";
import {HttpStatusCode} from "axios";
import {CustomResponse} from "../Responses/CustomResponse";
import {RouteBuilder} from "../../route-builder";

var routes: { path: string, method: string }[] = [];

export function Controller(name: string, desc?: string) {
    return function (target: Function) {
        console.log("controller")
        let builder = DocumentBuilder.getInstance()
            .addTag(name, desc ?? 'default')

        routes.forEach(value => {
            builder.attachTagToRoute(name, value.path, value.method)
        })
    }
}

export function Get<T extends typeof Request>(
    path: string,
    requestClass?: new (arg: any) => InstanceType<T>,
    summary?: string
) {
    routes.push({
        path: path,
        method: DocumentBuilder.httpMethod.get
    })

    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        addToDocs(target, key, DocumentBuilder.httpMethod.get, path, requestClass, summary)

        descriptor.value = getRouteHandler(target, path, descriptor, requestClass)
        descriptor.value = descriptor.value.bind(target)

        let router: core.Router = express.Router();
        router.get(path, descriptor.value)
        RouteBuilder.getInstance().addRoute(path, router, DocumentBuilder.httpMethod.get);

        return descriptor;
    };
}

export function Post<ReQ extends typeof Request, ReS extends typeof Request>(
    path: string,
    requestClass?: new (arg: any) => InstanceType<ReQ>,
    summary?: string
) {
    routes.push({
        path: path,
        method: DocumentBuilder.httpMethod.post
    })

    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        addToDocs(target, key, DocumentBuilder.httpMethod.post, path, requestClass, summary)

        descriptor.value = getRouteHandler(target, path, descriptor, requestClass)
        descriptor.value = descriptor.value.bind(target)

        let router = express.Router();
        router.post(path, descriptor.value)
        RouteBuilder.getInstance().addRoute(path, router, DocumentBuilder.httpMethod.post);

    };
}

export function Put<T extends typeof Request>(
    path: string,
    requestClass?: new (arg: any) => InstanceType<T>,
    summary?: string
) {
    routes.push({
        path: path,
        method: DocumentBuilder.httpMethod.put
    })

    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        addToDocs(target, key, DocumentBuilder.httpMethod.put, path, requestClass, summary)

        descriptor.value = getRouteHandler(target, path, descriptor, requestClass)
        descriptor.value = descriptor.value.bind(target)

        let router = express.Router();
        router.put(path, descriptor.value)
        RouteBuilder.getInstance().addRoute(path, router, DocumentBuilder.httpMethod.put);
    };
}

export function Delete<T extends typeof Request>(
    path: string,
    requestClass?: new (arg: any) => InstanceType<T>,
    summary?: string
) {
    routes.push({
        path: path,
        method: DocumentBuilder.httpMethod.delete
    })

    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        addToDocs(target, key, DocumentBuilder.httpMethod.delete, path, requestClass, summary)

        descriptor.value = getRouteHandler(target, path, descriptor, requestClass)
        descriptor.value = descriptor.value.bind(target)

        let router = express.Router();
        router.delete(path, descriptor.value)
        RouteBuilder.getInstance().addRoute(path, router, DocumentBuilder.httpMethod.delete);
    };
}

export function Patch<T extends typeof Request>(
    path: string,
    requestClass?: new (arg: any) => InstanceType<T>,
    summary?: string
) {
    routes.push({
        path: path,
        method: DocumentBuilder.httpMethod.patch
    })

    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        addToDocs(target, key, DocumentBuilder.httpMethod.patch, path, requestClass, summary)

        descriptor.value = getRouteHandler(target, path, descriptor, requestClass)
        descriptor.value = descriptor.value.bind(target)

        let router = express.Router();
        router.patch(path, descriptor.value)
        RouteBuilder.getInstance().addRoute(path, router, DocumentBuilder.httpMethod.patch);
    };
}

function addToDocs<T extends typeof Request>(
    target: any,
    key: string,
    method: string,
    path: string,
    requestClass?: new (arg: any) => InstanceType<T>,
    summary?: string
) {
    let parameterTypes = Reflect.getMetadata('design:paramtypes', target, key);
    parameterTypes = parameterTypes.filter((type: any) => type !== requestClass);

    const responseType = Reflect.getMetadata('design:returntype', target, key);
    const responseClass = responseType.prototype.constructor;
    console.log(responseClass)

    DocumentBuilder.getInstance().addPath({
        path: path,
        method: method,
        response: responseClass,
        request: requestClass,
        params: parameterTypes,
        summary: summary,
    });
}

function getRouteHandler<T extends typeof Request>(
    target: any,
    path: string,
    descriptor: PropertyDescriptor,
    dtoClass?: new (arg: any) => InstanceType<T>,
) {
    const originalMethod = descriptor.value;
    const paramNames: string[] = extractRouteParams(path);

    descriptor.value = async function (req: ExpressRequest, res: ExpressResponse, next: NextFunction) {

        let paramArgs: any[] = [];
        paramNames.forEach((paramName: string, index: number) => {
            paramArgs.push(req.params[paramName])
        });

        if (dtoClass != null) {
            let errorMessage = await Request.validate(req, dtoClass)
            if (errorMessage.length > 0) {
                res.status(HttpStatusCode.UnprocessableEntity).json({errors: errorMessage});

                return;
            }

            req = await Request.mapper(req, dtoClass)
        }

        let response;

        if (paramArgs.length != 0) {
            response = originalMethod.call(this, paramArgs, req) as CustomResponse;
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
