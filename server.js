const express = require(`express`);
const bodyParser = require(`body-parser`);
const initRouters = require(`./routes/index`);
const {PORT} = require(`./config`);

const app = express();

app.use(bodyParser.json());

initRouters(app);

app.listen(PORT, (err) => {
  if (err) {
    console.log(err.message);
  }
  console.log(`Server is running on ${PORT}`);
});

module.exports = app;
