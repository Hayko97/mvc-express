import {CommandBuilder} from "yargs";
import {execSync} from "child_process";
import moment from 'moment';

export const command = 'migrations:generate <dbName>';
export const desc = 'Generate migrations';

export const builder: CommandBuilder = (yargs) =>
    yargs
        .positional('dbName', {type: 'string', demandOption: true})

export const handler = (argv: any) => {
    console.log(generateName())
    execSync(`typeorm migration:generate database/carDb/migrations/${generateName()} -d dist/database/${argv.dbName}/DataSource.js`, {stdio: 'inherit'});
    process.exit(0);
};

const generateName = () => {
    const now = moment();
    const formattedDateTime = now.format('YYYY-MM-DD_HH-mm-ss');
    return `version_${formattedDateTime}`;
};