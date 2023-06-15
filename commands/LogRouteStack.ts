import "reflect-metadata"
import type {Arguments, CommandBuilder} from 'yargs';
import {Application} from "express";
import {App} from "../app/app";
import {AppContainer} from "../app/app-container";
import {Server} from "../server";

// type Options = {
//     name: string;
//     upper: boolean | undefined;
// };

export const command: string = 'log:routes';
export const desc: string = 'Logging all route stack';

export const builder: CommandBuilder = (yargs) =>
    yargs
        .options({
            upper: {type: 'boolean'},
        })
        .positional('name', {type: 'string', demandOption: true});

export const handler = (): void => {
    let app = App.getInstance();
    AppContainer.create().then((container: AppContainer) => {
        app.builder.errorHandlers();
    });

    logRouteStack(App.getInstance().getApp());
    process.exit(0);
};

export function logRouteStack(app: Application): void {
    function logLayer(layer: any, prefix: string = ''): void {
        if (layer.route) {
            console.log(`Route: ${prefix}${layer.route.path}`);
            layer.route.stack.forEach((middleware: any) => {
                console.log(`  Middleware: ${middleware.name || 'anonymous'}`);
            });
        } else if (layer.name === 'router') {
            const subRouter = layer.handle;
            const subRouterPrefix = `${prefix}${layer.path}`;
            console.log(`Sub-Router: ${subRouterPrefix}`);
            subRouter.stack.forEach((subLayer: any) => logLayer(subLayer, subRouterPrefix));
        } else {
            console.log(`Middleware: ${layer.name || 'anonymous'}`);
        }
    }

    console.log('Routes and Middlewares:');

    app._router.stack.forEach((layer: any) => logLayer(layer));
}