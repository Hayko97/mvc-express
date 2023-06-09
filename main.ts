import "reflect-metadata"
import {Server} from "./server";
import {AppContainer} from "./app/app-container";
import {logRequestHierarchy} from "./app/app";

let container = AppContainer.getInstance()

Server.setup(
    container.app
).start()

container.bindControllers();

logRequestHierarchy(container.app, container.app._router)


// function logParameter(target: any, propertyKey: string | symbol, parameterIndex: number) {
//     const originalMethod = target[propertyKey];
//
//     target[propertyKey] = function (...args: any[]) {
//         const decoratedParameter = args[parameterIndex];
//         console.log(`Parameter value: ${decoratedParameter}`);
//
//         return originalMethod.apply(this, args);
//     };
// }
//
// function logParameterValue() {
//     return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
//         logParameter(target, propertyKey, parameterIndex);
//     };
// }
//
// class ExampleClass {
//     greet(@logParameterValue() message: string) {
//         console.log(`Message: ${message}`);
//     }
// }
//
// const example = new ExampleClass();
// example.greet("Hello, world!");

