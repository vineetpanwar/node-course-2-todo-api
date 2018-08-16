//standard imports
var express = require('express');
var bodyParser = require('body-parser');

//local imports
var {mongoose} = require('./db/mongoose.js');
var  {Todo} = require('./models/todo.js');
var  {User} = require('./models/user.js');

var app = express();

app.use(bodyParser.json());

app.post('/todos',(req,res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }).catch((err) => {
    res.status(400).send(err);
  });

});

app.listen(3000, () => {
  console.log('server is up at 3000');
});

module.exports = {
  app
};
























/*
//creating the instance of our model
var newTodo = new Todo({
  text:'Cook Dinner'
});

//Adding a Todo in the database
newTodo.save().then((doc) => {
  console.log('Saved Todo',doc);
}, (err) => {
  console.log('Unable to save todo',err);
});

var newTodo1 = new Todo({
  text:'Drive Bike',
  completed:false,
  completedAT:2018
});
newTodo1.save().then((doc) => {
  console.log('Saved Todo',doc);
},(err) => {
  console.log('Unable to save todo',err);
});




var user1 = new User({
  email:'vineet@gamil.com',
  password:'123456'
});

user1.save().then((doc) => {
  console.log('Saved doc',doc);

}, (err) => {
  console.log('Unalble to save the doc',err)
});

*/
