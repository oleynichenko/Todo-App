const todosRouter = require(`./todos`);
const usersRouter = require(`./users`);

const initRouters = (app) => {
  app.use(`/todos`, todosRouter);
  app.use(`/users`, usersRouter);
};

module.exports = initRouters;
