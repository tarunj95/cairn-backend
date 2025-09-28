const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService , stravaService} = require('../services');
const httpStatus = require('http-status');
const { userService } = require('../services');
const catchAsync = require('../utils/catchAsync');


const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getStravaProfile = async (req, res) => {
  const user = req.user;

  if (!user.accessToken) {
    return res.status(httpStatus.UNAUTHORIZED).send({ message: 'Missing Strava token' });
  }

  const profile = await getStravaAthlete(user.accessToken);
  res.status(httpStatus.OK).send(profile);
};


const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Unsubscribe a user (set subscribed = false)
 */
const unsubscribe = catchAsync(async (req, res) => {
  const { userId } = req.params; // expecting /users/:userId/unsubscribe
  const user = await userService.unsubscribeUser(userId);
  res.status(httpStatus.OK).send({ message: 'You have been unsubscribed', user });
});


module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getStravaProfile,
  unsubscribe,
};
