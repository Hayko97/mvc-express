import express, {Application, Express, NextFunction, Request, Response} from "express";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import createHttpError, {HttpError} from "http-errors";
import {HttpStatusCode} from "axios";
import morgan from "morgan";

let expressApp: Express;
let builder: Builder;

function app(target: any) {
    expressApp = express();
}

function build(target: any) {
    builder = new Builder(expressApp);
    builder.build();
}

@app
export class App {

    private static instance: App;

    public getApp(): Express {
        return expressApp;
    }

    public static getInstance(): App {
        if (!App.instance) {
            App.instance = new App();
        }

        return App.instance;
    }

    get builder(): Builder {
        return builder;
    }
}

@build
class Builder {
    private readonly _app: Express;

    constructor(app: Express) {
        this._app = app;
    }

    public build() {
        this.logging()
        this.parsers();
        this.viewEngine();
        this.cors()
        this._app.use(cookieParser());
        this._app.use(express.static(path.join('../../', __dirname, 'public')));

        return this._app;
    }

    public parsers() {
        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({extended: true}));
    }

    public viewEngine() {
        this._app.set('views', path.join(__dirname, '../../app/views'));
        this._app.set('view engine', 'pug');
    }

    public cors() {
        this._app.use(cors());
    }

    public logging() {
        this._app.use(morgan('tiny'));
    }

    public errorHandlers() {
        this._app.use(function (req: Request, res: Response, next: NextFunction) {
            next(createHttpError(HttpStatusCode.NotFound));
        });

        this._app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            if (err instanceof HttpError) {
                res.status(err.status);
                res.render('error');
            } else {
                res.status(HttpStatusCode.InternalServerError);
                res.send('Server Error');
            }
        });
    }
}