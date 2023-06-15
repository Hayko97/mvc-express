import {DataSource} from "typeorm";
// import {connections} from "../../config/database";
import {parseNumber} from "libphonenumber-js";
import {DataSourceOptions} from "typeorm/data-source/DataSourceOptions";
import {connections} from "../../config/database";

export class CarDataSource extends DataSource {
    constructor() {
        super(connections.carDB);
    }
}