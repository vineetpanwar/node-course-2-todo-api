
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('../models/todo');
const {User} = require('../models/user');


const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const users=[{
  _id:userOneID,
  email:'vineetpanwar027@gmail.com',
  password:'userOnePass',
  tokens:[{
    access:'auth',
    token:jwt.sign({_id:userOneID,access:'auth'},process.env.JWT_SECRET).toString()
  }]
},{
    _id:userTwoID,
    email:'sumitpanwar027@gmail.com',
    password:'userTwoPass',
    tokens:[{
      access:'auth',
      token:jwt.sign({_id:userTwoID,access:'auth'},process.env.JWT_SECRET).toString()
    }]
}];

const todos = [{
  _id: new ObjectID(),
  text:'first todo',
  _creator:userOneID
},
{
  _id: new ObjectID(),
  text:'second todo',
  completed:true,
  completedAT:345,
  _creator:userTwoID
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    return Promise.all([userOne,userTwo]);
  }).then(() => done());
};
module.exports = {
  populateTodos,todos,users,populateUsers
}
