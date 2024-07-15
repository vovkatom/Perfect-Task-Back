const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');

const swaggerDocument = require('./swagger.json');
const authRouter = require('./routes/authRouter');
const boardsRouter = require('./routes/boardsRouter');
const columnsRouter = require('./routes/columnsRouter');
const cardsRouter = require('./routes/cardsRouter');
const mongoose = require('mongoose');
require('dotenv/config');

const { DB_HOST, PORT = 3000 } = process.env;

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', authRouter);
app.use('/api/boards', boardsRouter);
app.use('/api/columns', columnsRouter);
app.use('/api/cards', cardsRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'error.html'));
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log('Database connection successful');
    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });

module.exports = app;
