import {HttpStatusCode} from "axios";

export interface PathOption {
    path: string;
    method: string;
    response?: ResponseScheme
    request?: RequestBody
    params?: Parameter[],
    summary?: string;
}

export interface RequestBody {
    scheme: string;
    properties: Record<string, object>;
    required?: boolean;
}

export interface Parameter {
    name: string;
    in: "query" | "path";
    description?: string;
    required?: boolean;
    schema?: { type: string };
}

export interface ResponseScheme {
    scheme: string;
    statusCode: HttpStatusCode;
    properties: Record<string, object>;
    description: string;
}