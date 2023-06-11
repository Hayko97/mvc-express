import dotenv from "dotenv";

dotenv.config();
export const logging = {
    console: {
        enabled: true,
    },
    file: {
        enabled: true,
        level: process.env.LOG_LEVEL,
        filename: process.env.LOG_FILE,
        exceptionFilename: process.env.LOG_FILE_EXCEPTION,
        fileSize: process.env.LOG_FILE_SIZE,
        tailable: process.env.LOG_TAILABLE,
        maxFiles: process.env.LOG_MAX_FILES
    },
}