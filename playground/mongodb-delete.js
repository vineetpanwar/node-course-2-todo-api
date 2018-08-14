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

  //deleteMany
  //db.collection('Todo').deleteMany({text:'Eat lunch'}).then((result) => {
  //  console.log(result);
  //});

  //deleteOne
  //db.collection('Todo').deleteOne({text:'Eat lunch'}).then((result) => {
  //  console.log(result);
  //});

  //findOneAndDelete
  //db.collection('Todo').findOneAndDelete({completed:false}).then((result) => {
  //  console.log(result);
  //});

  db.collection('Users').deleteMany({name:'vineet'}).then((result) => {
    console.log(result);
  });

  db.collection('Users').findOneAndDelete({_id : new ObjectID('5b6fedaa65dc089b2c72481d')}).then((result) => {
    console.log(JSON.stringify(result,undefined,2));
  })





  //db.close();
});
