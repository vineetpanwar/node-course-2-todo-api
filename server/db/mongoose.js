//config file require
require('../config/config.js');
var mongoose = require('mongoose');

const dbuser = 'tfg123';
const dbpassword = 'trade123';


mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/TodoApp');
//mongoose.connect(process.env.MongoDB_URI || 'mongodb://localhost:27015/TodoApp');
console.log(process.env.MongoDB_URI);
if(process.env.NODE_ENV === 'production'){
console.log('here');
  mongoose.connect(`mongodb://${dbuser}:${dbpassword}@ds125862.mlab.com:25862/vindata`);
}
else{
  mongoose.connect(process.env.MongoDB_URI);
}
module.exports = {
  mongoose
};
