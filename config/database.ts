import {parseNumber} from "libphonenumber-js";
import {DataSourceOptions} from "typeorm/data-source/DataSourceOptions";

const carDBOptions: DataSourceOptions = {
    type: "mysql",
    host: process.env.CAR_DB_HOST || "",
    port: parseInt(process.env.CAR_DB_PORT || "3306", 10),
    username: process.env.CAR_DB_USERNAME || "",
    password: process.env.CAR_DB_PASSWORD || "",
    database: process.env.CAR_DATABASE_NAME || "",
    entities: ["./database/sql/carDb/entities*.ts"],
    migrations: ["./database/sql/carDb/migrations/"],
    logging: true,
    synchronize: true,
};

// const mongoDbOptions: DataSourceOptions = {
//     type: "mongodb",
//     host: process.env.MYSQL_DB_HOST,
//     port: parseInt(process.env.MYSQL_PORT || "3306", 10),
//     username: process.env.MYSQL_USERNAME,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE_NAME,
//     entities: ["./database/carDb/entities/*.ts"],
//     logging: true,
//     synchronize: true,
//
// };

export const connections = {
    carDB: carDBOptions,
    //mongo: mongoDbOptions,
}

export enum Connections {
    carDb = "carDb",
    mongo = "mongo",
}

