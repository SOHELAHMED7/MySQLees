const mysql = require('mysql');
const mysqlees = require('./build/index');

mysqlees.connect(mysql, {
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
});

mysqlees.options({
    autoMigration: true
});

const customers = mysqlees.schema({
    id: {
        primaryKey: true,
        autoIncrement: true,
        datatype: {
            name: 'int'
        }
    },
    name: {
        datatype: {
            name: 'varchar',
            size: '255'
        }
    }
}, {
    timestamps: true
});

const orders = mysqlees.schema({
    id: {
        primaryKey: true,
        autoIncrement: true,
        datatype: {
            name: 'int'
        },
        renamedFrom: 'order_id'
    },
    customer_id: {
        datatype: {
            name: 'int',
            size: 11
        },
        ref: {
            to: 'customers',
            foreignField: 'id'
        },
    },
    tempText: {
        primaryKey: true,
        datatype: {
            name: 'int',
            size: 11
        },
        renamedFrom: 'text2'
    },
    new2: {
        datatype: {
            name: 'varchar',
            size: 255
        },
        unique: false,
        renamedFrom: 'new'
    },
}, {
    timestamps: true
});

orders.index('text', 'text', {
    unique: true,
    deprecated: true
});

const m = mysqlees.model('orders', orders);
const m2 = mysqlees.model('customers', customers);                