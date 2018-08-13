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

  db.collection('Todo').find({_id: new ObjectID('5b707597a038422829a1147c')}).toArray().then((docs) => {
    console.log('Todo');
    console.log(JSON.stringify(docs,undefined,2));

  }).catch((err) => {
    console.log('Unable to fetch Todo',err);
  });

  db.collection('Todo').find().count().then((count) => {
    console.log(`Todo Count: ${count}`);

  }).catch((err) => {
    console.log('Unable to fetch Todos',err);
  });

  db.collection('Users').find({name:'vineet'}).toArray().then((docs) => {
    console.log('Users');
    console.log(JSON.stringify(docs,undefined,2));

  }).catch((err) => {
    console.log('Unable to fetch Todo',err);
  });




  //db.close();
});
