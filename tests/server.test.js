const expect = require(`expect`);
const request = require(`supertest`);

const app = require(`../server`);
const Todo = require(`../db/todos-model`);

const todos = [
  {text: `First test todo`},
  {text: `Second test todo`}
];

beforeEach((done) => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
});

describe(`POST /todos`, () => {
  it(`should create a new todo`, function (done) {
    const text = `Test text`;

    request(app)
      .post(`/todos`)
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

              todo.delete((e) => {
                if (e) {
                  done(e);
                } else {
                  done();
                }
              });
            })
            .catch((error) => done(error));
        }
      });
  });

  it(`should not create todo with empty text field`, function (done) {
    const text = ``;

    request(app)
      .post(`/todos`)
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
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty(`todos`);

        if (res.body.todos.length !== 0) {
          expect(res.body.todos[0]).toHaveProperty(`text`);
        }
      })
      .end(done);
  });
});

describe(`PATCH /todos/:id`, () => {
  it(`should update the todo`, (done) => {

  });

  it(`should clear completedAt when todo is not completed`, (done) => {

  });
});
