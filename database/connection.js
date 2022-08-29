const sqlite3 = require('sqlite3').verbose();
var debug = require('debug')('domoserver:database');
const path = require('path');

const db = new sqlite3.Database(path.join(process.cwd(),'database', process.env.DB_NAME),(err)=>{
    if(err){
        debug(`${err.message}`);
        throw err;
    }else{
        debug('conectado a based de datos SQLite.');
        db.exec(`
            create table if not exists config (
                key nvarchar(20) primary key not null,
                value nvarchar(100) not null
            );
            insert into config (key, value) values ("ip","x.x.x.x");
        `,(err)=>{
            if( err){
                debug('error en base de datos');
                return;
            }
            debug('base de datos ok');
        });
    }
})

module.exports = db;