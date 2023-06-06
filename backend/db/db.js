const { Pool } = require('pg');


const pool = new Pool({
  user: 'postgres',
  host: '34.133.89.224',
  database: 'sacdb',
  password: 'Florentino25##',
  port: 5432,
});

module.exports = {
  pool,
};