import express, {Express} from 'express';
import dotenv from 'dotenv';
import http from 'http';
import ErrnoException = NodeJS.ErrnoException;
import {debug} from "util";
//Initialize Environment Variables from .env
dotenv.config();

const port = normalizePort({val: process.env.PORT || '3000'});

function normalizePort({val}: { val: string }) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

export class Server {

    private static instance: Server;
    private readonly _httpServer: http.Server;

    private constructor(app: Express) {
        this._httpServer = http.createServer(app);
    }

    public static setup(app: Express): Server {
        if (!Server.instance) {
            Server.instance = new Server(app);
        }

        return Server.instance;
    }

    public start(): void {
        this._httpServer.on('error', this.onError);
        this._httpServer.on('listening', this.onListening);

        this._httpServer.listen(port);
    }

    private onError = (error: ErrnoException): void => {
        if (error.syscall !== 'listen') {
            throw error;
        }

        let bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    private onListening = (): void => {
        let address = this._httpServer.address();
        let bind = null;

        if (address == null) {
            throw new Error('Address Can not be null')
        }

        if (typeof address === 'string') {
            bind = `pipe ${address}`;
        } else {
            bind = `port ${address.port}`;
        }

        debug('Listening on ' + bind);
    }
}
