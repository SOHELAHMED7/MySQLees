#!/usr/bin/env node
'use strict';

const ArgumentParser = require('argparse').ArgumentParser;
const mysqlees       = require('./build/index');
const execSync       = require('child_process').execSync;
const path           = require('path');
const fs             = require('fs');


const parser = new ArgumentParser({
    version: '1.0.0',
    addHelp: true,
    description: 'MySQLees CLI'
});

parser.addArgument(
    ['-m', '--migrate'],
    {
        action: 'storeTrue',
        help: 'Migrate Schemas'
    }
);

parser.addArgument(
    ['-c', '--config'],
    {
        help: 'Configuration File'
    }
);

const args = parser.parseArgs();

let mysql, sleep = false;
try {
    mysql = require('mysql');
} catch(err) {
    sleep = true;
    console.log('Installing MySQL Package (https://www.npmjs.com/package/mysql)...');
    execSync('npm install --save mysql');
    console.log('MySQL Package Installed Successfully!!');
}

const cli = () => {
    if (args.migrate) {
        
        const cwd        = process.cwd();
        const config     = args.config ? args.config : 'mysqlees.json'; 
        const configPath = path.join(cwd, config);
        
        if (fs.existsSync(configPath)) {
            const json = JSON.parse(fs.readFileSync(configPath));
    
            mysql = require('mysql');
            mysqlees.bind(mysql);
            mysqlees.migrate(args.migrate, json.migration.connection);
    
            for(let value of json.migration.models) {
                if (fs.existsSync(value)) {
                    require(value);
                } else {
                    console.log(`Error: Model not found!! (Invalid Path: ${value})`);
                }
            }
        } else {
            console.log(`Error: ${config} not found!! (Invalid Path: ${path.join(cwd, config)})`);
        }
    }
}

if (sleep) {
    setTimeout(cli, 2000);
} else {
    cli();
}

