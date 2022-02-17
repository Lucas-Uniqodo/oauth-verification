// add sqlite dependency
const sqlite3 = require('sqlite3').verbose()
// add the bcrypt dependency
const bcrypt = require('bcrypt');

const DBSOURCE = "db.sqlite"

// setup the database
let db = new sqlite3.Database(DBSOURCE, (err) => { // TODO - ask about this logic
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    } else {
        console.log('connected to the SQLite database...');

        db.serialize(() => {
            // the code as it stands, recreates the table each time the server is restarted
            db.run(`DROP TABLE IF EXISTS users`,
                (err) => {
                    if (err) {
                        console.log('unable to delete table due to ' + err);
                    } 
                });
            db.run(`DROP TABLE IF EXISTS messages`,
                (err) => {
                    if (err) {
                        console.log('unable to delete table due to ' + err);
                    } 
                });
            db.run(`CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username text,
            password text
            )`,
                async (err) => {
                    if (err) {
                        console.log('table already created...');
                        // table already created
                    } else {
                        // table just created, creating some rows
                        const fr1Password   = await bcrypt.hash('fred_300', 10);
                        const wm1Password   = await bcrypt.hash('wilma_301', 10);
                        const pb1Password   = await bcrypt.hash('pebbles_321', 10);
                        const adminPassword = await bcrypt.hash('secret', 10);
                        const insert = 'INSERT INTO users (username, password) VALUES (?,?)';
                        db.run(insert, ["fr1", fr1Password]);
                        db.run(insert, ["wm1", wm1Password]);
                        db.run(insert, ["pb1", pb1Password]);
                        db.run(insert, ["admin", adminPassword]);
                        console.log('password hashes added to database');
                    }
                });
                db.run(`CREATE TABLE messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    message text
                    )`,
                        async (err) => {
                            if (err) {
                                console.log('table already created...');
                                // table already created
                            } else {
                                // table just created, creating some rows
                                const insert = 'INSERT INTO messages (message) VALUES (?)';
                                db.run(insert, ["message one"]);
                                console.log('messages added to database');
                            }
                        });
        });
    }
});


module.exports = db