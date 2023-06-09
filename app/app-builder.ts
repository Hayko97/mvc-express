import * as path from "path";
import * as createError from "http-errors"
import express, {Express, NextFunction, Request, Response} from "express";
import bodyParser from "body-parser";
import {injectable} from "inversify";
import {AppContainer} from "./app-container";
import {Cors} from "./http/Middleware/Cors";
import {Auth} from "./http/Middleware/Auth";
import {Middleware} from "./http/Middleware/Middleware";
import {AppException} from "./exceptions/AppException";
import {HttpStatusCode} from "axios";
import cors from 'cors';

export class AppBuilder {
    private readonly _app: Express;

    constructor(app: Express) {
        this._app = app;
    }

    public build(): AppBuilder {
        this.configureParsers();
        this.configureViewEngine();
        this.configureCors()
        this.configureMiddlewares()
        this.handleErrors()

        return this;
    }

    public configureMiddlewares() {
        new Cors()
    }

    private configureParsers() {
        // Required for POST requests
        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({extended: true}));
    }

    private configureViewEngine() {
        // Required for POST requests
        this._app.set('views', path.join(__dirname, 'views'));
        this._app.set('view engine', 'pug');
    }

    public configureCors() {
        this._app.use(cors());
    }

    public handleErrors() {
        this._app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
            res.status(HttpStatusCode.NotFound).send("Not Found")
        });

        this._app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
            if (err instanceof AppException) {
                res.status(err.StatusCode).json({error: err.message});
            } else {
                res.status(HttpStatusCode.InternalServerError).json({error: 'Internal Server Error'});
            }
        });
    }
}
