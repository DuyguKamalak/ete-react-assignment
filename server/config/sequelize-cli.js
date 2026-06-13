// Configuration consumed by sequelize-cli for migrations and seeders.
// Values are read from the same environment variables the application uses.
require('dotenv').config();

const common = {
  username: process.env.DB_USER || 'ete_user',
  password: process.env.DB_PASSWORD || 'ete_password',
  database: process.env.DB_NAME || 'ete_db',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  dialect: 'postgres',
  // Track which seeders have run so `db:seed:all` stays idempotent across restarts.
  seederStorage: 'sequelize',
};

module.exports = {
  development: common,
  test: common,
  production: common,
};
