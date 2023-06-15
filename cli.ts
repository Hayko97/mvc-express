#!/usr/bin/env node

import yargs, {strict} from 'yargs';
import {hideBin} from 'yargs/helpers';
import * as path from "path";

yargs(hideBin(process.argv))
    .commandDir(path.join(__dirname, './commands'))
    .strict()
    .alias({h: 'help'})
    .argv;