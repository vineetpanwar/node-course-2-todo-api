//config file require
require('./config/config.js');
//standard imports
var  express    = require('express');
var  bodyParser = require('body-parser');
var  {ObjectID} = require('mongodb');
var  _          = require('lodash');
var bcrypt      = require('bcryptjs');

//local imports
var  {mongoose}    = require('./db/mongoose.js');
var  {Todo}        = require('./models/todo.js');
var  {User}        = require('./models/user.js');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT ;

app.use(bodyParser.json());

//Login requests
app.post('/users/login',(req,res) => {
  var body = _.pick(req.body,['email','password']);

  User.findByCredentials(body.email,body.password).then((user) => {
    return  user.generateAuthToken().then((token) => {
      res.header('x-auth',token).send(user);
    });
  }).catch((err) => {
    res.status(400).send();
  });
});

//Logout requests-deleting token
app.delete('/users/me/delete',authenticate,(req,res) => {
  req.user.removeToken(req.token).then(() => {
    //resolve case
    res.status(200).send();
  },() => {
    //reject case
    res.status(400).send()
  });
});



//Post request for Todo
app.post('/todos',authenticate,(req,res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator:req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

//Post request for user
app.post('/users',(req,res) => {
  var body = _.pick(req.body,['email','password']);
  console.log(body);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    //console.log('tokens',tokens.tokens);
    //var usertoken = tokens.token;
    res.header('x-auth',token).send(user);
  }).catch((err) => {
    res.status(400).send(err);
  });
});


//Get request for user for private route
app.get('/users/me',authenticate,(req,res) => {
  res.send(req.user);
});

//GetAllReq
app.get('/todos',authenticate, (req,res) => {
  Todo.find({
    _creator:req.user._id
  }).then((todos) => {
    res.send({todos});
  }).catch((e) => {
    res.status(400).send(e);
  });
});

//Get Specific record By Id
app.get('/todos/:id' , authenticate, (req,res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id))
  {
    res.status(404).send({});
  }
  Todo.findOne({
    _id:id,
    _creator:req.user._id
  }).then((Todo) => {
    if(!Todo){
      res.status(404).send();
    }
    res.status(200).send({Todo});
  }).catch((err) => {
    res.status(400).send();
  })

});

//Delete specific record
app.delete('/todos/:id',authenticate,(req,res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    res.status(404).send({});
  }
  Todo.findOneAndRemove({
    _id:id,
    _creator:req.user._id
  }).then((Todo) => {
    if(!Todo){
      return res.status(404).send();
    }
    res.status(200).send({Todo});
  }).catch((err) => {
    res.status(400).send();
  });
});

//Update a document
app.patch('/todos/:id',authenticate,(req,res) => {
  var id = req.params.id;
  var body = _.pick(req.body,['text','completed']);
  if(!ObjectID.isValid(id)){
    res.status(404).send({});
  }
  if(_.isBoolean(body.completed) && body.completed){
    body.completedAT = new Date().getTime();
  }
  else{
    body.completed = false;
    body.completedAT = null;
  }
  Todo.findOneAndUpdate({
    _id:id,
    _creator:req.user._id
  },{$set:body},{new: true}).then((todo) => {
    if(!todo){
      return res.status(404).send({});
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send({});
  });
});

app.listen(port, () => {
  console.log(`Started up at port:${port}`);
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
