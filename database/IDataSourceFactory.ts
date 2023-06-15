import "reflect-metadata"
import {DataSource} from "typeorm"

export interface IDataSourceFactory {
    getInstance(connection: string): DataSource;
}