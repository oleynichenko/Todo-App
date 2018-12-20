const mongoose = require(`mongoose`);
const jwt = require(`jsonwebtoken`);

const secret = require(`../../config`);
const Todo = require(`../../db/todos-model`);
const User = require(`../../db/users-model`);

const userOneId = mongoose.Types.ObjectId();
const userTwoId = mongoose.Types.ObjectId();

const todos = [
  {
    _id: mongoose.Types.ObjectId(),
    text: `First test todo`,
    _creator: userOneId
  },
  {
    text: `Second test todo`,
    _creator: userTwoId
  }
];

const users = [
  {
    _id: userOneId,
    email: `userOne@exaple.com`,
    password: `userOnePas`,
    tokens: [{
      access: `auth`,
      token: jwt.sign({_id: userOneId.toHexString(), access: `auth`}, secret).toString()
    }]
  },
  {
    _id: userTwoId,
    email: `userTwo@exaple.com`,
    password: `userTwoPas`,
    tokens: [{
      access: `auth`,
      token: jwt.sign({_id: userTwoId.toHexString(), access: `auth`}, secret).toString()
    }]
  }
];

const populateTodos = (done) => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {
  todos,
  users,
  populateTodos,
  populateUsers
};
