import {AppBuilder} from "./app-builder";

export function get(path: string) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
       AppBuilder.getInstance().app.use(path, descriptor.value);
    };
}