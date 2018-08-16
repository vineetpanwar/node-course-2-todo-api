var mongoose = require('mongoose');

//Defining a model

var Todo = mongoose.model('Todo' ,{
  text: {
    type:String,
    required:true,
    minlength:1,
    trim:true
  },
  completed:{
    type:Boolean,
    default:false
  },
  completedAT:{
    type:Number,
    default:null
  }
});

module.exports = {
  Todo
};
