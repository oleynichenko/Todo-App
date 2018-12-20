const express = require(`express`);
const _ = require(`lodash`);
const User = require(`../db/users-model`);
const authenticate = require(`../middlewares/authenticate`);

const router = new express.Router();

router.post(`/`, (req, res) => {
  const body = _.pick(req.body, [`email`, `password`]);
  const user = new User(body);

  user.save()
    .then((savedUser) => {
      return savedUser.generateAuthToken();
    })
    .then((token) => {
      res.header(`x-auth`, token).send(user);
    })
    .catch((err) => res.status(400).send(err));
});

router.get(`/me`, authenticate, (req, res) => {
  res.send(req.user);
});

router.post(`/login`, (req, res) => {
  const body = _.pick(req.body, [`email`, `password`]);

  User.findByCredentials(body.email, body.password)
    .then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header(`x-auth`, token).send(user);
      });
    }).catch(() => res.status(400).send());
});

router.delete(`/me/token`, authenticate, (req, res) => {
  req.user.removeToken(req.token)
    .then(() => res.send())
    .catch(() => res.status(400).send());
});

module.exports = router;
