import {CommandBuilder} from "yargs";
import {execSync} from "child_process";
import moment from 'moment';

export const command = 'migrations:run <dbName>';
export const desc = 'Run migrations';

export const builder: CommandBuilder = (yargs) =>
    yargs
        .positional('dbName', {type: 'string', demandOption: true})

export const handler = (argv: any) => {
    execSync(`typeorm migration:run -d dist/database/${argv.dbName}/DataSource.js`, {stdio: 'inherit'});
    process.exit(0);
};