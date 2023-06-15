import {convertPropertyToSwagger, getSwaggerType} from "../helpers";
import {Parameter, RequestBody} from "../interfaces";

export var requestBody: RequestBody | undefined;

function newRequestBody(): RequestBody {
    return {
        properties: {},
        required: false,
        scheme: "",
    }
}

export var parameter: Parameter | undefined;

function newParameter(): Parameter {
    return {
        name: "",
        in: 'path',
        required: false,
        schema: {
            type: "string"
        },
    }
}

export function clearRequestScheme() {
    requestBody = undefined
}

export function Property(summary?: string) {
    return function (target: any, propertyName: string) {
        const propertyType = Reflect.getMetadata('design:type', target, propertyName);
        if (!requestBody) {
            requestBody = newRequestBody();
        }

        requestBody.properties[propertyName] = convertPropertyToSwagger(propertyName, propertyType)

        Reflect.defineMetadata('propertyType', propertyType, target, propertyName);
    }
}

export function PathParam(name?: string, required?: boolean) {
    return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
        const parameterTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
        const parameterNames = Reflect.getMetadata('design:paramnames', target, propertyKey);

        const parameterName = parameterNames[parameterIndex];
        const parameterType = parameterTypes[parameterIndex].name;

        if (!parameter) {
            parameter = newParameter();
        }

        parameter.name = name ?? parameterName
        parameter.required = required ?? parameter.required

        parameter.schema = {type: getSwaggerType(parameterType)}
    }
}

export function ApiRequest(scheme?: string) {
    return function (target: Function) {
        if (requestBody) {
            requestBody.scheme = scheme ?? target.name;
        }
    };
}