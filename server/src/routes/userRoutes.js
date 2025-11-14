const userRouter = require('express').Router();

userRouter.get('/', (req, res) => {
  res.json({msg:'connected'})
})

module.exports = userRouter;