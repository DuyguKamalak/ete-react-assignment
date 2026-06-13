import { createApp } from './app';
import { sequelize } from './models';
import { env } from './config/env';

async function start() {
  try {
    await sequelize.authenticate();
    // In development we let Sequelize keep the schema in sync with the models for
    // convenience. In Docker/production the schema is managed by migrations, so
    // set DB_SYNC=false there to skip this.
    if (process.env.DB_SYNC !== 'false') {
      await sequelize.sync({ alter: true });
      console.log('Database connected and synchronized.');
    } else {
      console.log('Database connected (schema managed by migrations).');
    }

    const app = createApp();
    app.listen(env.port, () => {
      console.log(`API server listening on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
