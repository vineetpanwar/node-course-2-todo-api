var env = process.env.NODE_ENV || 'development';
const dbuser = 'tfg123';
const dbpassword = 'trade123';

//console.log('env is-',process.env.NODE_ENV);
if(env === 'development' || env ==='test'){
  var config = require('./config.json');
  var envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}


/*
if(env === 'test'){
  console.log('here');
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoTestApp';
}
else if(env === 'production'){
  console.log('Here it goes into prod');
  //process.env.MONGODB_URI = `mongodb://${dbuser}:${dbpassword}@ds125862.mlab.com:25862/vindata`;
}
else{
  console.log('In dev');
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
}
*/
