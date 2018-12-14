const express = require(`express`);
const bodyParser = require(`body-parser`);
const {ObjectID} = require(`mongodb`);
const _ = require(`lodash`);

const Todo = require(`./db/todos-model`);
const {PORT} = require(`./config`);

const app = express();

app.use(bodyParser.json());

app.post(`/todos`, (req, res) => {
  const todo = new Todo(req.body);

  todo.save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.delete(`/todos/:id`, (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(400).send();
  } else {
    Todo.findByIdAndRemove(id)
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

app.get(`/todos`, (req, res) => {
  Todo.find()
    .then((todos) => {
      res.send({todos});
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.get(`/todos/:id`, (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(400).send({});
  } else {
    Todo.findById(id)
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

app.patch(`/todos/:id`, (req, res) => {
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

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
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

app.listen(PORT, (err) => {
  if (err) {
    console.log(err.message);
  }
  console.log(`Server is running`);
});

module.exports = app;
