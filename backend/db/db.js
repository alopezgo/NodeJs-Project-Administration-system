const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '34.176.7.179',
  database: 'portafolio',
  password: 'Ignacia77##',
  port: 5432,
});

module.exports = {
  pool,
};