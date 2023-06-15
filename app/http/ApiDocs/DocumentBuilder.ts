import {Express, request as expressRequest} from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from "swagger-jsdoc";
import {PathOption, RequestBody, ResponseScheme} from "./interfaces";
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

    public addPath(path: PathOption) {

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
                in: param.in,
                name: param.name,
                schema: param.schema,
                description: param.description,
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

    private addResponse(
        response: ResponseScheme,
        methodObj: any
    ) {
        methodObj.responses = {
            [response.statusCode]: {
                content: {
                    'application/json': {
                        schema: {
                            $ref: `#/components/schemas/${response.scheme}`,
                        },
                    },
                }
            }
        };

        this.swaggerOptions.swaggerDefinition!.components.schemas[response.scheme] = {
            type: 'object',
            properties: response.properties
        };
    }

    private addRequest(
        requestScheme: RequestBody,
        methodObj: any
    ) {
        methodObj.requestBody = {
            required: requestScheme.required ?? false,
            content: {
                'application/json': {
                    schema: {
                        $ref: `#/components/schemas/${requestScheme.scheme}`,
                    },
                },
            }
        };

        this.swaggerOptions.swaggerDefinition!.components.schemas[requestScheme.scheme] = {
            type: 'object',
            properties: requestScheme.properties
        };

        return methodObj;
    }


    public build(app: Express) {
        this.swaggerOptions.swaggerDefinition!["tags"] = this.tags;
        const swaggerSpec = swaggerJsdoc(this.swaggerOptions);
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }
}
