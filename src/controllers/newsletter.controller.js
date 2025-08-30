const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { newsletterService } = require('../services');

const addEmail = catchAsync(async (req, res) => {
  const user = await newsletterService.newsletterSignUp(req.body.email);
  res.status(httpStatus.CREATED).send(user);
});


// const deleteUser = catchAsync(async (req, res) => {
//   await userService.deleteUserById(req.params.userId);
//   res.status(httpStatus.NO_CONTENT).send();
// });

module.exports = {
  addEmail
};
