const express = require(`express`);
const {ObjectID} = require(`mongodb`);
const _ = require(`lodash`);

const authenticate = require(`../middlewares/authenticate`);

const Todo = require(`../db/todos-model`);

const router = new express.Router();

router.get(`/`, authenticate, (req, res) => {
  Todo.find({_creator: req.user._id})
    .then((todos) => {
      res.send({todos});
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post(`/`, authenticate, (req, res) => {
  const todo = new Todo(req.body);
  todo._creator = req.user._id;

  todo.save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.delete(`/:id`, authenticate, (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(400).send();
  } else {
    Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    })
      .then((todo) => {
        if (!todo) {
          res.status(404).send();
        }

        res.send({todo});
      })
      .catch(() => {
        res.status(500).send();
      });
  }
});

router.get(`/:id`, authenticate, (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(400).send({});
  } else {
    Todo.findOne({
      _id: id,
      _creator: req.user._id
    })
      .then((todo) => {
        if (!todo) {
          res.status(404).send({});
        } else {
          res.send({todo});
        }
      })
      .catch(() => res.status(500).send({}));
  }
});

router.patch(`/:id`, authenticate, (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(400).send({});
  }

  const body = _.pick(req.body, [`text`, `completed`]);

  if (body.completed && _.isBoolean(body.completed)) {
    body.completedAt = Date.getTime();
  } else {
    body.completedAt = null;
    body.completed = false;
  }

  Todo.findOneAndUpdate(
      {_id: id, _creator: req.user._id},
      {$set: body}, {new: true})
    .then((todo) => {
      if (!todo) {
        res.status(404).send();
      }

      res.send(todo);
    })
    .catch(() => {
      res.status(400).send();
    });
});

module.exports = router;
