import { Sequelize } from 'sequelize';
import { env } from '../config/env';

/**
 * Sequelize instance.
 *
 * During tests (NODE_ENV=test) we fall back to an in-memory SQLite database so
 * the suite can run anywhere without a running PostgreSQL server. In every other
 * environment we connect to PostgreSQL using the credentials from `.env`.
 */
const sslOption =
  process.env.DB_SSL === 'true'
    ? { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } }
    : {};

function buildSequelize(): Sequelize {
  if (env.nodeEnv === 'test') {
    return new Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false });
  }

  // Managed providers (e.g. Render) expose a single connection string.
  if (process.env.DATABASE_URL) {
    return new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      ...sslOption,
    });
  }

  return new Sequelize(env.db.name, env.db.user, env.db.password, {
    host: env.db.host,
    port: env.db.port,
    dialect: 'postgres',
    logging: false,
    ...sslOption,
  });
}

export const sequelize = buildSequelize();
