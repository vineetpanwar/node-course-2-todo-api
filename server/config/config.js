var env = process.env.NODE_ENV || 'development';
const dbuser = 'tfg123';
const dbpassword = 'trade123';

console.log('env is-',process.env.NODE_ENV);


if(env === 'test'){
  console.log('here');
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoTestApp';
}
else if(env === 'production'){
  process.env.MONGODB_URI = `mongodb://${dbuser}:${dbpassword}@ds125862.mlab.com:25862/vindata`;
}
else{
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
}
