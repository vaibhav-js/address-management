const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'users_database',
    user: 'postgres',
    password: 'admin',
});

module.exports = {pool};