require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(PORT, () => {
      console.log(
        `Server is running on port ${PORT} (${process.env.NODE_ENV || 'development'})`
      );
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);

  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

startServer();
