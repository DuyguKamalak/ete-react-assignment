import { createApp } from './app';
import { sequelize } from './models';
import { env } from './config/env';

async function start() {
  try {
    await sequelize.authenticate();
    // `alter: true` keeps the schema in sync with the models during development.
    await sequelize.sync({ alter: true });
    console.log('Database connected and synchronized.');

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
