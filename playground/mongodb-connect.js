//const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');//destucturing objects-better way of requiring

//creating ObjectID manually
//var obj = new ObjectID();
//console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
  if(err){
    return console.log('Unable to connect to mongodb server');
  }
  console.log('Connected to MongoDB server');

/*
  db.collection('Todo').insertOne({
    text:'something to do',
    completed:false
  },(err,result) => {
    if(err){
      return console.log('Unable to insert Todo',err);
    }
    console.log(JSON.stringify(result.ops,undefined,2));
  });
  */


  db.collection('Users').insertOne({
    name:'vineet',
    age:23,
    location:'H M halli'
  },(err,result) => {
    if(err){
      return console.log('Unable to insert User',err);
    }
    console.log(JSON.stringify(result.ops,undefined,2));
    console.log(result.ops[0]._id.getTimestamp());
  });


  db.close();
});
