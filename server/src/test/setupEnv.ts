// Force the test environment so Sequelize uses an in-memory SQLite database.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
