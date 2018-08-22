//config file require
require('../config/config.js');

var mongoose = require('mongoose');


mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/TodoApp');
//mongoose.connect(process.env.MongoDB_URI || 'mongodb://localhost:27015/TodoApp');
console.log(process.env.MongoDB_URI);
mongoose.connect(process.env.MongoDB_URI);
module.exports = {
  mongoose
};
