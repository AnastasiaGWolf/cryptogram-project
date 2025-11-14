const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const session = require('express-session');
const router = require('./routes/indexRoute');

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));

module.exports = app.use('/api', router);
