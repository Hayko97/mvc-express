import {RequestBody} from "../DocumentBuilder";

export var requestBody: RequestBody = {
    content: {},
    summary: "",
    scheme: "",
}

export function Item(summary?: string) {
    return function (target: any, propertyName: string) {
        const propertyType = Reflect.getMetadata('design:type', target, propertyName);
        console.log(requestBody.content)
        requestBody.content[propertyName] = {type: propertyType.name.toLowerCase()}
        requestBody.scheme = summary ?? ""

        Reflect.defineMetadata('propertyType', propertyType, target, propertyName);
    }
}

export function ApiRequest(scheme?: string) {
    return function (target: Function) {
        requestBody.scheme = scheme ?? target.name;
    };
}