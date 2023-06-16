import {Request} from "../http/Requests/Request";
import {string} from "yargs";
import {DocumentBuilder} from "../http/ApiDocs/DocumentBuilder";
import * as core from "express-serve-static-core";
import express, {NextFunction, request, Request as ExpressRequest, Response as ExpressResponse} from "express";
import {HttpStatusCode} from "axios";
import {CustomResponse} from "../http/Responses/CustomResponse";
import {RouteBuilder} from "../builders/route-builder";
import {clearRequestScheme, parameter, requestBody} from "../http/ApiDocs/Decorators/ApiRequest";
import {clearResponseScheme, responseScheme} from "../http/ApiDocs/Decorators/ApiResponse";
import {convertExpressPathToSwagger, convertParamsToSwaggerParams} from "../http/ApiDocs/helpers";

var routeDecorators: { path: string, method: string }[] = [];

export function Controller(name: string, desc?: string) {
    return function (target: Function) {
        let builder = DocumentBuilder.getInstance()
            .addTag(name, desc ?? 'default')

        routeDecorators.forEach(value => {
            builder.attachTagToRoute(name, value.path, value.method)
        })
    }
}

export function Get<T extends typeof Request>(
    path: string,
    requestClass?: new (arg: any) => InstanceType<T>,
    summary?: string
) {
    routeDecorators.push({
        path: path,
        method: DocumentBuilder.httpMethod.get
    })

    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        addToDocs(target, key, DocumentBuilder.httpMethod.get, path, requestClass, summary)

        descriptor.value = getRouteHandler(target, path, descriptor, requestClass)
        descriptor.value = descriptor.value.bind(target)


        RouteBuilder.getInstance().addRoute(path, DocumentBuilder.httpMethod.get, descriptor.value);

        return descriptor;
    };
}

export function Post<ReQ extends typeof Request, ReS extends typeof Request>(
    path: string,
    requestClass?: new (arg: any) => InstanceType<ReQ>,
    summary?: string
) {
    routeDecorators.push({
        path: path,
        method: DocumentBuilder.httpMethod.post
    })

    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        addToDocs(target, key, DocumentBuilder.httpMethod.post, path, requestClass, summary)

        descriptor.value = getRouteHandler(target, path, descriptor, requestClass)
        descriptor.value = descriptor.value.bind(target)

        RouteBuilder.getInstance().addRoute(path, DocumentBuilder.httpMethod.post, descriptor.value);

    };
}

export function Put<T extends typeof Request>(
    path: string,
    requestClass?: new (arg: any) => InstanceType<T>,
    summary?: string
) {
    routeDecorators.push({
        path: path,
        method: DocumentBuilder.httpMethod.put
    })

    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        addToDocs(target, key, DocumentBuilder.httpMethod.put, path, requestClass, summary)

        descriptor.value = getRouteHandler(target, path, descriptor, requestClass)
        descriptor.value = descriptor.value.bind(target)

        RouteBuilder.getInstance().addRoute(path, DocumentBuilder.httpMethod.put, descriptor.value);
    };
}

export function Delete<T extends typeof Request>(
    path: string,
    requestClass?: new (arg: any) => InstanceType<T>,
    summary?: string
) {
    routeDecorators.push({
        path: path,
        method: DocumentBuilder.httpMethod.delete
    })

    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        addToDocs(target, key, DocumentBuilder.httpMethod.delete, path, requestClass, summary)

        descriptor.value = getRouteHandler(target, path, descriptor, requestClass)
        descriptor.value = descriptor.value.bind(target)

        RouteBuilder.getInstance().addRoute(path, DocumentBuilder.httpMethod.delete, descriptor.value);
    };
}

export function Patch<T extends typeof Request>(
    path: string,
    requestClass?: new (arg: any) => InstanceType<T>,
    summary?: string
) {
    routeDecorators.push({
        path: path,
        method: DocumentBuilder.httpMethod.patch
    })

    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        addToDocs(target, key, DocumentBuilder.httpMethod.patch, path, requestClass, summary)

        descriptor.value = getRouteHandler(target, path, descriptor, requestClass)
        descriptor.value = descriptor.value.bind(target)

        RouteBuilder.getInstance().addRoute(path, DocumentBuilder.httpMethod.patch, descriptor.value);
    };
}

function addToDocs<T extends typeof Request>(
    target: any,
    key: string,
    method: string,
    path: string,
    requestClass?: new (arg: any) => InstanceType<T>,
    summary?: string,
) {

    if (!parameter) {

    }

    let parameterTypes = Reflect.getMetadata('design:paramtypes', target, key);
    const paramNames: string[] = extractRouteParams(path);

    DocumentBuilder.getInstance().addPath({
        path: convertExpressPathToSwagger(path),
        method: method,
        response: responseScheme,
        request: requestBody,
        params: convertParamsToSwaggerParams(paramNames, parameterTypes),
        summary: summary,
    });

    clearRequestScheme();
    clearResponseScheme();
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
            console.log(req.params)
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
