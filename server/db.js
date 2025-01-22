const { Pool } = require('pg');

// Replace these values with your PostgreSQL credentials
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'collaborative_whiteboard',
//   password: 'iwsxivmg',
//   port: 5432,
// });

const pool = new Pool({
  user: 'postgres',
  host: 'postgres.railway.internal',
  database: 'railway',
  password: 'JqqJzGBQvqcdtFwgjjeBgjbwZTVLwCnu',
  port: 5432,
});
module.exports = pool;