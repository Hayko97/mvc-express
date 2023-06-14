import * as express from 'express';
import {Express, request as expressRequest} from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from "swagger-jsdoc";
import {CustomResponse} from "../Responses/CustomResponse";
import {Request} from "../Requests/Request";
import {string} from "yargs";
import * as core from "express-serve-static-core";
import {CreateHomeRequest} from "../Requests/CreateHomeRequest";

export interface PathOption<ReQ extends typeof Request, ReS extends typeof CustomResponse> {
    path: string;
    method: string;
    response?: new (...args: any) => InstanceType<ReS>
    request?: new (...args: any) => InstanceType<ReQ>
    params?: string[]
    summary?: string
}

export interface RequestBody {
    scheme: string;
    content: Record<string, object>;
    summary?: string;
}

export class DocumentBuilder {
    private static instance: DocumentBuilder;
    private readonly swaggerOptions: swaggerJSDoc.Options;
    private tags: { name: string, description: string }[] = [];

    public static readonly httpMethod = {
        get: 'get',
        post: 'post',
        put: 'put',
        delete: 'delete',
        patch: 'patch'
    }

    private constructor() {
        this.swaggerOptions = {
            swaggerDefinition: {
                openapi: '3.0.0',
                info: {
                    title: process.env.APP_NAME as string,
                    version: '1.0.0',
                    description: process.env.APP_DESCRIPTION,
                },
                servers: [
                    {
                        url: process.env.APP_URL, // The base URL of your API
                    },
                ],
                paths: {},
                components: {
                    schemas: {}
                }
            },
            apis: [],
        };
    }

    public static getInstance(): DocumentBuilder {
        if (!DocumentBuilder.instance) {
            DocumentBuilder.instance = new DocumentBuilder();
        }

        return DocumentBuilder.instance;
    }

    public addTag(name: string, description: string) {
        this.tags.push({
            name: name,
            description: description
        });

        return this;
    }

    public attachTagToRoute(tag: string, path: string, method: string) {
        this.swaggerOptions.swaggerDefinition!.paths[path][method].tags = [tag]
        return this;
    }

    public addPath<ReQ extends typeof Request, ReS extends typeof CustomResponse>(
        path: PathOption<ReQ, ReS>
    ) {

        let pathObj = this.swaggerOptions.swaggerDefinition!.paths[path.path] || {};
        let methodObj = pathObj[path.method] || {};

        methodObj.summary = path.summary || `${path.method} ${path.path}`;
        methodObj.responses = {
            "200": {
                description: 'OK',
            },
        };

        if (path.params) {
            methodObj.parameters = path.params.map(param => ({
                in: 'query',
                name: param,
                schema: {
                    type: 'string',
                },
                description: param,
            }));
        }

        if (path.request) {
            methodObj = this.addRequest(path.request, methodObj)
        }

        if (path.response) {
            this.addResponse(path.response, methodObj)
        }

        pathObj[path.method] = methodObj;
        this.swaggerOptions.swaggerDefinition!.paths[path.path] = pathObj;

        return this;
    }

    private addResponse<ReS extends typeof CustomResponse>(
        response: new (...args: any) => InstanceType<ReS>,
        methodObj: any
    ) {
        const responseDtoName = response.name;

        methodObj.responses = {
            "200": {
                content: {
                    'application/json': {
                        schema: {
                            $ref: `#/components/schemas/${responseDtoName}`,
                        },
                    },
                }
            }
        };

        this.swaggerOptions.swaggerDefinition!.components.schemas[responseDtoName] = {
            type: 'object',
            properties: responseProperties(response)
        };

    }

    private addRequest<ReS extends typeof Request>(
        request: new (...args: any) => InstanceType<ReS>,
        methodObj: any
    ) {
        const requestDtoName = request.name;

        methodObj.requestBody = {
            content: {
                'application/json': {
                    schema: {
                        $ref: `#/components/schemas/${requestDtoName}`,
                    },
                },
            }
        };

        this.swaggerOptions.swaggerDefinition!.components.schemas[requestDtoName] = {
            type: 'object',
            properties: requestProperties(request)
        };

        return methodObj;
    }


    public build(app: Express) {
        this.swaggerOptions.swaggerDefinition!["tags"] = this.tags;
        const swaggerSpec = swaggerJsdoc(this.swaggerOptions);
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }
}

function requestProperties(requestClass: any) {

    const propertiesWithTypes: Record<string, object> = {};
    Object.getOwnPropertyNames(requestClass.prototype)
        .filter(value => value != 'constructor')
        .forEach(value => {
            const propertyType = Reflect.getMetadata('design:type', requestClass.prototype, value);
            if (propertyType.name === "Array") {
                propertiesWithTypes[value] = {
                    type: 'array',
                    items: {type: propertyType.name.toLowerCase()}
                }
            } else {
                propertiesWithTypes[value] = {type: propertyType.name.toLowerCase()};
            }
        });

    return propertiesWithTypes;
}

function responseProperties(responseClass: any) {

    const propertiesWithTypes: Record<string, object> = {};

    Object.getOwnPropertyNames(responseClass.prototype)
        .filter(value => value != 'constructor')
        .forEach(value => {
            const propertyType = Reflect.getMetadata('design:type', responseClass.prototype, value);

            if (propertyType) {
                if (propertyType.name === "Array") {
                    propertiesWithTypes[value] = {
                        type: 'array',
                        items: {type: propertyType.name.toLowerCase()}
                    }
                } else {
                    propertiesWithTypes[value] = {type: propertyType.name.toLowerCase()};
                }
            }
        });


    return propertiesWithTypes;
}
