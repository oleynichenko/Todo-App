require(`dotenv`).config();

const PORT = process.env.PORT || 3000;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;

const DB_NAME = (process.env.NODE_ENV === `test`)
  ? process.env.DB_TEST_NAME
  : process.env.DB_NAME;

// process.env.MONGODB_URI is set on HEROKU
const baseUrl = process.env.MONGODB_URI || `mongodb+srv://${USER}:${PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true`;

module.exports = {
  baseUrl,
  PORT
};
