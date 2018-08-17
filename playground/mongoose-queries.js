const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
var id = '5b7654d65dd82bb82725b188';
var Emailid = '5b744f46a02f6e94bbcbbbdc';

if(!ObjectID.isValid(id) || !ObjectID.isValid(Emailid)){
  return console.log('The ID of the row is not valid');
}

Todo.find({
  _id:id
}).then((todos) => {
  console.log('Todos',todos);
}).catch((err) => {
  console.log('ERROR FINDING',err);
});

Todo.findOne({
  _id:id
}).then((todo) => {
  if(!todo){
    return console.log('Id not found');
  }
  console.log('Todo',todo);
}).catch((err) => {
  console.log('ERROR FINDING',err);
});

Todo.findById(id).then((todo) => {
  if(!todo){
    return console.log('Id not found');
  }
  console.log('Todo By ID',todo);
}).catch((err) => {
  console.log('ERROR FINDING',err);
});

User.findById(Emailid).then((User) => {
  if(!User){
    return console.log('Email ID not found');
  }
  console.log('User',User);
}).catch((err) => {
  console.log('Error Finding',err);
});
