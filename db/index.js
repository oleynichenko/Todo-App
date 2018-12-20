const mongoose = require(`mongoose`);
const {baseUrl} = require(`../config`);

mongoose.set(`useCreateIndex`, true);
mongoose.connect(baseUrl, {useNewUrlParser: true});

module.exports = mongoose;
