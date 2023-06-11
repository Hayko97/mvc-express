import {classToClassFromExist} from "class-transformer";
import {validate, validateSync} from "class-validator";
import {Request, Response} from "express";
import {HttpStatusCode} from "axios";

export function Handle<T>(dtoClass: new (arg: any) => T) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (request: Request, response: Response) {
            var customRequest = new dtoClass(request)
            var requestPayload = await request.body;
            const dto = classToClassFromExist(requestPayload, customRequest);
            const errors = await validate(dto);

            if (errors.length > 0) {
                const errorMessages = errors.map(error => Object.values(error.constraints!)).flat();
                response.status(HttpStatusCode.UnprocessableEntity).json({errors: errorMessages});
            } else {
                return originalMethod.apply(this, [dto, response]);
            }
        };
    }
}
