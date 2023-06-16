import {IDataSourceFactory} from "./IDataSourceFactory";
import {DataSource} from "typeorm";
import {injectable} from "inversify";
import {carDB} from "./carDb/DataSource";

@injectable()
export class DataSourceFactory implements IDataSourceFactory {

    getInstance(connection: string): DataSource {
        switch (connection) {
            case Connections.carDb:
                return carDB;
            // case Connections.mongo:
            //     return new MongoDataSource();
            default:
                throw Error("Undefined Db Connection");
        }
    }
}

export enum Connections{
    carDb = "carDb",
}