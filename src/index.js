"use strict"

import Store from './lib/Store';
import Schema from './lib/Schema';
import Model from './lib/Model';

class MySQLees {
    connect(mysql, config) {
        Store.config = config;
        Store.connection = mysql.createConnection({...config, multipleStatements: true});
        return new Promise(function(resolve, reject) {
            Store.connection.connect(function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    model(model_name, schema) {
        return new Model(model_name, schema, Store);
    }

    schema(schema, options = {}) {
        return new Schema(schema, options);
    } 
}

module.exports = new MySQLees();