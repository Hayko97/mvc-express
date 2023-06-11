import winston from "winston";

export interface ILogger {
    getLogger(): winston.Logger
}