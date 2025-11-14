const router = require('express').Router();
const userRouter = require('./userRoutes');

module.exports = router
  .use('/user', userRouter)
  ;
  