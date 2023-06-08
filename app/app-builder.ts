import * as path from "path";
import * as createError from "http-errors"
import express, {Express} from "express";
import bodyParser from "body-parser";
import {injectable} from "inversify";
import {AppContainer} from "./app-container";

export class AppBuilder {
    private _app: Express;

    constructor(app: Express) {
        this._app = app;
    }

    public build(): Express {
        console.log("builder")
        this.configureMiddleware();
        this._app.set('views', path.join(__dirname, 'views'));
        this._app.set('view engine', 'pug');

        return this._app;
    }

    public configureMiddleware() {
        // Required for POST requests
        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({extended: true}));

        // CORS
        this._app.use(function (req, res, next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
            next();
        });
    }
}
