import {HttpStatusCode} from "axios";
import {NextFunction, Request, Response} from "express";
import {App} from "../app";
import {HttpError} from "http-errors";

export class EntityNotFound extends HttpError {

}