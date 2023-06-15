import {Parameter} from "./DocumentBuilder";
import {string} from "yargs";

export function convertPropertyToSwagger(propertyName: string, propertyType: any): any {
    const swaggerProperty: any = {};
    swaggerProperty.type = getSwaggerType(propertyType);
    if (swaggerProperty.type === 'array') {
        swaggerProperty.items = {type: getElementType(propertyType)};
    } else if (swaggerProperty.type === 'object') {
        const properties: any = {};
        for (const key in propertyType) {
            if (propertyType.hasOwnProperty(key)) {
                const value = propertyType[key];
                properties[key] = convertPropertyToSwagger(key, value);
            }
        }
        swaggerProperty.properties = properties;
    }
    return swaggerProperty;
}

export function convertParamsToSwaggerParams(paramsNames: any, paramsTypes: any): Parameter[] {

    let parameters: Parameter[] = [];
    paramsTypes = getSwaggerParamsFromTypes(paramsTypes);

    paramsTypes.forEach((type: any, index: number) => {
        parameters.push({
            name: paramsNames[index],
            in: "path",
            required: false,
            schema: {type: type},
        })
    });

    return parameters;
}

export function convertExpressPathToSwagger(expressPath: string) {
    return expressPath
        .replace(/:(\w+)/g, '{$1}') // Replace Express.js route parameters with Swagger path parameters
        .replace(/\?/g, '') // Remove question marks for optional parameters (adjust this based on your application logic)
        .replace(/\*/g, '{wildcard}') // Convert wildcard segments to a named parameter in Swagger (adjust as needed)
        .replace(/\*\*/g, '{catchall}');
}

function getSwaggerParamsFromTypes(types: any) {
    return types.filter((type: any) => {
        if (typeof type !== 'function' || /^\s*class\s+/.test(type.toString())) {
            return false;
        }

        return type.name !== "Object";
    }).map((type: any) => {
        return getSwaggerType(type)
    });
}

export function getSwaggerType(type: any): string {
    if (type === String) {
        return 'string';
    } else if (type === Number) {
        return 'integer';
    } else if (type === Boolean) {
        return 'boolean';
    } else if (type === Array) {
        return 'array';
    } else if (typeof type === 'function' && type.name !== 'Object') {
        return type.name;
    } else {
        return 'object';
    }
}

function getElementType(type: any): any {
    if (type === Array) {
        const elementType = type[0];
        console.log(elementType)
        if (elementType !== undefined) {
            return getSwaggerType(elementType);
        }
    }
    return undefined;
}