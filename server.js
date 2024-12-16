const app = require('./src/app');
const { sequelize } = require('./src/models'); // Sequelize instance

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Sync models (optional in dev, avoid force:true in prod)
    await sequelize.sync();
    console.log('Models synchronized.');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1); // Exit with failure
  }
};

startServer();
