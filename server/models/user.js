const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true,
    trim:true,
    minlength:1,
    unique:true,
    validate:{
      validator:validator.isEmail,
      message:'{value} is not a valid email'
    }
  },
  password:{
    type:String,
    required:true,
    minlength:6
  },
  tokens:[{
    access:{
      type:String,
      required:true
    },
    token:{
      type:String,
      required:true
    }
  }]
});

//Override the return of the array back to the User and limiting what to send.
UserSchema.methods.toJSON = function(){
  var user = this;
  var objectUser = user.toObject();
  return(_.pick(objectUser,['_id','email']));
}

//method to generate the auth token
UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id : user._id.toHexString(),access},'TFG123').toString();
  console.log(access);
  console.log(token);
  //user.tokens.push({access,token});
  user.tokens = user.tokens.concat([{access,token}]);
  return user.save().then(() => {
    //console.log(user);
    //console.log(JSON.stringify(user.tokens,undefined,1));
    //var result = _.nth(user.tokens,[n=1]);
    return token;
  });
}

var User = mongoose.model('User' , UserSchema);
module.exports = {
  User
};
