const { Pool } = require('pg');


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sac_local',
  password: '0000001',
  port: 5432,
});

module.exports = {
  pool,
};