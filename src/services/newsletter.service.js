const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Newsletter } = require('../models');

const newsletterSignUp = async(email) =>{
    if (await Newsletter.isEmailTaken(email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exist!');
      }
      return Newsletter.create({email});
}

const newsletterUnsubscribe = async(email) =>{
    if (await Newsletter.isEmailTaken(email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exist!');
      }
      // remove method
    //   return Newsletter.create(email);
}

module.exports = {
  newsletterSignUp,
  newsletterUnsubscribe
};
