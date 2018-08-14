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

  db.collection('Todo').findOneAndUpdate({
    _id: new ObjectID('5b6fe7130a7ab5a99866e890')
  },{
    $set:{
      completed:false
    }
  },{
    returnOriginal:false
  }).then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log('unable to update',err);
  });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5b6fe8e96d129f0c64494a85')
  },{
      $set:{
        name:'sumit panwar'
      },
      $inc:{
        age:1
      }
    },
    {
      returnOriginal:false
    }
  ).then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log('Unable to update the value');
  });


  //db.close();
});
