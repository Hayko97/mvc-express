import * as path from "path";
import * as createError from "http-errors"
import express, {Express} from "express";
import bodyParser from "body-parser";

export class AppBuilder {

    private readonly _app = express();
    private static instance: AppBuilder;

    private constructor() {

        this._app = express();
        console.log( 'app-builder construct')
    }

    public static getInstance(): AppBuilder {
        if (!AppBuilder.instance) {
            AppBuilder.instance = new AppBuilder();
        }

        console.log( 'app-builder')
        return AppBuilder.instance;
    }

    get app(): Express {
        return this._app;
    }

    public build(): Express {
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