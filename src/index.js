require('dotenv').config()

const express = require('express');
const app = express();

// Sql Server Setup
const sql = require('mssql');
const config = {
    "user": process.env.SQLUSER,
    "password": process.env.SQLPASS,
    "server": process.env.SQLSERVER,
    "database": process.env.SQLDB,
    "options": {
        "encrypt": false,
        "enableArithAbort": true
    },
};
sql.on('error', err => {
    console.log(err);
});

// Get all symbols
app.get('/symbols/', (req, res)=>{
    sql.connect(config).then(pool => {
        return pool.request()
            .query('select * from SymbolsTbl')
    }).then(result => {
        res.send(result.recordset);
    }).catch(err => {
        console.log(err)
    });
});

// Get a specefic symbol
app.get('/symbol/', (req, res) => {
    const symbolName = req.query['name'];
    sql.connect(config).then(pool => {
        return pool.request()
            .query(`select * from SymbolsTbl where name=N${symbolName}`)
    }).then(result => {
        res.send(result.recordset);
    }).catch(err => {
        console.log(err)
    });
});




app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`)
})