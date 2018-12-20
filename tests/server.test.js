const expect = require(`expect`);
const request = require(`supertest`);
const {todos, users, populateTodos, populateUsers} = require(`./seed`);

const app = require(`../server`);
const Todo = require(`../db/todos-model`);

beforeEach(populateUsers);
beforeEach(populateTodos);

// after(() => {
//   process.exit(0);
// });

describe(`POST /todos`, () => {
  it(`should create a new todo`, function (done) {
    const text = `Test text`;

    request(app)
      .post(`/todos`)
      .set(`x-auth`, users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
        expect(res.body).toHaveProperty(`_id`);
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          Todo.findOne({_id: res.body._id})
            .then((todo) => {
              expect(todo.text).toBe(text);
              done();
            })
            .catch((error) => done(error));
        }
      });
  });

  it(`should not create todo with empty text field`, function (done) {
    const text = ``;

    request(app)
      .post(`/todos`)
      .set(`x-auth`, users[0].tokens[0].token)
      .send({text})
      .expect(400)
      .expect((res) => {
        expect(res.body).toHaveProperty(`errors`);
      })
      .end(done);
  });
});

describe(`GET /todos`, () => {
  it(`should get all todos`, function (done) {
    request(app)
      .get(`/todos`)
      .set(`x-auth`, users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty(`todos`);
      //
        if (res.body.todos.length !== 0) {
         expect(res.body.todos[0]).toHaveProperty(`text`);
        }
      })
    .end(done);
  });
});

describe(`DELETE /todos/:id`, () => {
  const hexId = todos[0]._id.toHexString();

  it(`should delete the todo`, (done) => {

    request(app)
      .delete(`/todos/${hexId}`)
      .set(`x-auth`, users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err) => {
        if (err) {
          done(err);
        } else {
          Todo.findById(hexId)
            .then((todo) => {
              expect(todo).toBeFalsy();
              done();
            })
            .catch((e) => done(e));
        }
      });
  });

  it(`should return 400 if object id is invalid`, (done) => {
    request(app)
      .delete(`/todos/123`)
      .set(`x-auth`, users[0].tokens[0].token)
      .expect(400)
      .end(done);
  });

  it(`should return 401 if user is not autherised`, (done) => {
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(401)
      .end(done);
  });
});

describe(`GET /users/me`, () => {
  it(`should return user if authenticated`, (done) => {

    request(app)
      .get(`/users/me`)
      .set(`x-auth`, users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it(`should return 401 if not authenticated`, (done) => {
    request(app)
      .get(`/users/me`)
      .expect(401)
      .end(done);
  });
});

describe(`POST /users`, () => {
  it(`should create a user`, (done) => {
    request(app)
      .post(`/users`)
      .send({email: `test1@gmail.com`, password: `12345`})
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(`test1@gmail.com`);
        expect(res.headers).toHaveProperty(`x-auth`);
        expect(res.body).toHaveProperty(`_id`);
      })
      .end(done);
  });

  it(`should return error if request invalid`, (done) => {
    done();
  });

  it(`should not create a user if email in use`, (done) => {
    done();
  });
});

describe(`POST /users/login`, () => {
  it(`should login user and return auth token`, (done) => {
    // если вернули токен значит user с таки токеном есть в базе
    done();
  });

  it(`should reject invalid login`, (done) => {
    done();
  });
});

describe(`DELETE /users/me/token`, () => {
  it(`should remove auth token on logout`, (done) => {
    done();
  });
});
