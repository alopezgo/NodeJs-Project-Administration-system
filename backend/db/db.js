const { Pool } = require('pg');


const pool = new Pool({
  user: 'postgres',
  host: '34.133.89.224',
  database: 'sacdb',
  password: 'Ignacia77##',
  port: 5432,
});

module.exports = {
  pool,
};