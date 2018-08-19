var mongoose = require('mongoose');
const dbuser = 'Vineetpanwar027';
const dbpassword = 'binnypanwar27@';

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/TodoApp');
//mongoose.connect(process.env.MongoDB_URI || 'mongodb://localhost:27015/TodoApp');
mongoose.connect(`mongodb://${dbuser}:${dbpassword}@ds125862.mlab.com:25862/vindata` || 'mongodb://localhost:27015/TodoApp');
module.exports = {
  mongoose
};
