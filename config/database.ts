export const database = {
    mysql: {
        host: process.env.MYSQL_DB_HOST,
        port: process.env.MYSQL_PORT,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE_NAME,
        entities: ["src/entity/*.js"],
        logging: true,
        synchronize: true,
    },
    mongo: {

    },
}