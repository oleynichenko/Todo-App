const mongoose = require(`mongoose`);
const {baseUrl} = require(`../config`);

mongoose.connect(baseUrl, {useNewUrlParser: true});

module.exports = mongoose;
