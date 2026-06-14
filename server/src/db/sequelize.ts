import { Sequelize } from 'sequelize';
import { env } from '../config/env';

/**
 * Sequelize instance.
 *
 * During tests (NODE_ENV=test) we fall back to an in-memory SQLite database so
 * the suite can run anywhere without a running PostgreSQL server. In every other
 * environment we connect to PostgreSQL using the credentials from `.env`.
 */
export const sequelize =
  env.nodeEnv === 'test'
    ? new Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false })
    : new Sequelize(env.db.name, env.db.user, env.db.password, {
        host: env.db.host,
        port: env.db.port,
        dialect: 'postgres',
        logging: false,
        // Enable SSL for managed/remote PostgreSQL providers when DB_SSL=true.
        ...(process.env.DB_SSL === 'true'
          ? { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } }
          : {}),
      });
