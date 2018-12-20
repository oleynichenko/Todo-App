const validator = require(`validator`);
const jwt = require(`jsonwebtoken`);
const bcrypt = require(`bcryptjs`);
const _ = require(`lodash`);
const mongoose = require(`./index`);

const {secret} = require(`../config`);

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    validate: validator.isEmail,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 1,
  },
  tokens: [{
    access: {
      type: String,
      required: false,
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.pre(`save`, function (next) {
  const user = this;

  if (!user.isModified(`password`)) {
    next();
  } else {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (error, hash) => {
        user.password = hash;
        next();
      });
    });
  }
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  return _.pick(userObject, [`_id`, `email`]);
};

UserSchema.methods.generateAuthToken = function () {
  const user = this;
  const access = `auth`;

  const token = jwt.sign({_id: user._id.toHexString(), access}, secret).toString();

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function (token) {
  const user = this;

  return user.update({
    $pull: {
      tokens: token
    }
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  const User = this;

  return User.findOne({email})
    .then((user) => {
      if (!user) {
        return Promise.reject;
      }

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            resolve(user);
          } else {
            reject();
          }
        });
      });
    });
};

UserSchema.statics.findByToken = function (token) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, secret);
  } catch (err) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    // 'tokens.access': decoded.access,
    'tokens.token': token
  });
};

module.exports = mongoose.model(`User`, UserSchema);
