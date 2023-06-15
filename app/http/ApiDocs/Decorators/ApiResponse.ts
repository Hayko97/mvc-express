import {ResponseScheme} from "../DocumentBuilder";
import {HttpStatusCode} from "axios";
import {convertPropertyToSwagger} from "../helpers";

export var responseScheme: ResponseScheme | undefined = {
    scheme: "",
    statusCode: HttpStatusCode.Ok,
    properties: {},
    description: "",
};

export function ApiResponse(scheme?: string, status?: HttpStatusCode) {
    return function (target: Function) {
        if (responseScheme) {
            responseScheme.scheme = scheme ?? target.name;
            responseScheme.statusCode = status ?? HttpStatusCode.Ok;
        }
    };
}

export function Property(summary?: string) {
    return function (target: any, propertyName: string) {
        const propertyType = Reflect.getMetadata('design:type', target, propertyName);
        if (responseScheme) {
            responseScheme.properties[propertyName] = convertPropertyToSwagger(propertyName, propertyType)
            responseScheme.scheme = summary ?? ""
        }

        Reflect.defineMetadata('propertyType', propertyType, target, propertyName);
    }
}

export function clearResponseScheme() {
    responseScheme = undefined
}