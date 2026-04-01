const express = require('express');
const healthRoutes = require('./routes/healthRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Zorvyn Fintech API',
  });
});

app.use('/api', healthRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
