const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');


const newsletterSchema = mongoose.Schema(
  {
   
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (value && !validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
   
  },
  {
    timestamps: true,
  }
);

// Plugins
newsletterSchema.plugin(toJSON);
newsletterSchema.plugin(paginate);

// Static methods
newsletterSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  if (!email) return false;
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};



/**
 * @typedef Newsletter
 */
const Newsletter = mongoose.model('Newsletter', newsletterSchema);

module.exports = Newsletter;
