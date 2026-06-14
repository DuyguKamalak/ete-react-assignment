// Configuration consumed by sequelize-cli for migrations and seeders.
// Values are read from the same environment variables the application uses.
require('dotenv').config();

const ssl =
  process.env.DB_SSL === 'true'
    ? { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } }
    : {};

// Prefer a single DATABASE_URL (managed providers like Render) when present.
const common = process.env.DATABASE_URL
  ? {
      use_env_variable: 'DATABASE_URL',
      dialect: 'postgres',
      seederStorage: 'sequelize',
      ...ssl,
    }
  : {
      username: process.env.DB_USER || 'ete_user',
      password: process.env.DB_PASSWORD || 'ete_password',
      database: process.env.DB_NAME || 'ete_db',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      dialect: 'postgres',
      // Track which seeders have run so `db:seed:all` stays idempotent across restarts.
      seederStorage: 'sequelize',
      ...ssl,
    };

module.exports = {
  development: common,
  test: common,
  production: common,
};
