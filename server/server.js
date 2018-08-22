//config file require
require('./config/config.js');
//standard imports
var  express    = require('express');
var  bodyParser = require('body-parser');
var  {ObjectID} = require('mongodb');
var  _          = require('lodash');

//local imports
var  {mongoose} = require('./db/mongoose.js');
var  {Todo}     = require('./models/todo.js');
var  {User}     = require('./models/user.js');

var app = express();
const port = process.env.PORT ;

app.use(bodyParser.json());

//Post request
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

//GetAllReq
app.get('/todos', (req,res) => {
  Todo.find().then((todos) => {
    res.send({todos});
    });
});

//Get Specific record By Id
app.get('/todos/:id' , (req,res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id))
  {
    res.status(404).send({});
  }
  Todo.findById(id).then((Todo) => {
    if(!Todo){
      res.status(404).send();
    }
    res.status(200).send({Todo});
  }).catch((err) => {
    res.status(400).send();
  })

});

//Delete specific record
app.delete('/todos/:id',(req,res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    res.status(404).send({});
  }
  Todo.findByIdAndRemove(id).then((Todo) => {
    if(!Todo){
      return res.status(404).send();
    }
    res.status(200).send({Todo});
  }).catch((err) => {
    res.status(400).send();
  });
});

//Update a document
app.patch('/todos/:id',(req,res) => {
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
  Todo.findByIdAndUpdate(id,{$set:body},{new: true}).then((todo) => {
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
