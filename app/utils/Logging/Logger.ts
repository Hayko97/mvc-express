import winston, {level} from 'winston';
import {Logger as winstonLogger} from 'winston';
import winstonCloudWatch from 'winston-cloudwatch';
import {ILogger} from "./ILogger";
import {logging} from "../../../config/logging";
import {injectable} from "inversify";


@injectable()
export class Logger implements ILogger {

    private _logger: winstonLogger

    constructor() {
        this._logger = winston.createLogger({
            level: logging.file.level,

            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({timestamp, level, message}) => {
                    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
                })
            ),

            transports: [
                // Console logging transport
                new winston.transports.Console({
                    format: winston.format.colorize(),
                }),

                // File logging transport
                new winston.transports.File({
                    filename: logging.file.filename,
                    maxsize: Number(logging.file.fileSize),
                    maxFiles: Number(logging.file.maxFiles),
                    tailable: Boolean(logging.file.tailable),
                }),

                // CloudWatch logging transport
                // new winstonCloudWatch({
                //     // awsOptions: {
                //     //     credentials,
                //     //     region,
                //     // },
                //     logGroupName: 'my-app-logs',
                //     logStreamName: 'my-app-stream',
                //     awsRegion: 'us-west-1',
                //     retentionInDays: 30,
                //     jsonMessage: true,
                //     messageFormatter: ({level, message}) => `[${level.toUpperCase()}] ${message}`,
                // }),
            ],

            exceptionHandlers: [
                new winston.transports.File({filename: logging.file.exceptionFilename}),
                // new winstonCloudWatch({
                //     logGroupName: 'my-app-logs',
                //     logStreamName: 'exceptions-stream',
                //     awsRegion: 'us-west-1',
                //     jsonMessage: true,
                //     messageFormatter: ({level, message, stack}) => `[${level.toUpperCase()}] ${message}\n${stack}`,
                // }),
            ],
        });
    }

    public getLogger(): winston.Logger {
        return this._logger;
    }
}
