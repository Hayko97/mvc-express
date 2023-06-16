import {DataSource} from "typeorm";
// import {connections} from "../../config/database";
import {parseNumber} from "libphonenumber-js";
import {DataSourceOptions} from "typeorm/data-source/DataSourceOptions";
import dotenv from "dotenv";

dotenv.config()
export const carDB: DataSource = new DataSource({
    type: "mysql",
    host: process.env.CAR_DB_HOST || "",
    port: parseInt(process.env.CAR_DB_PORT || "3306", 10),
    username: process.env.CAR_DB_USERNAME || "",
    password: process.env.CAR_DB_PASSWORD || " ",
    database: process.env.CAR_DATABASE_NAME || "",
    entities: ["dist/database/carDb/entities/*.js"],
    migrations: ["database/sql/carDb/migrations/*.ts"],
    logging: true,
    synchronize: false,
});