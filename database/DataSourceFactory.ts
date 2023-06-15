import {IDataSourceFactory} from "./IDataSourceFactory";
import {DataSource} from "typeorm";
import {Connections, connections} from "../config/database";
import {CarDataSource} from "./carDb/CarDataSource";
import {injectable} from "inversify";

@injectable()
export class DataSourceFactory implements IDataSourceFactory {

    getInstance(connection: string): DataSource {
        switch (connection) {
            case Connections.carDb:
                return new CarDataSource();
            // case Connections.mongo:
            //     return new MongoDataSource();
            default:
                throw Error("Undefined Db Connection");
        }
    }
}