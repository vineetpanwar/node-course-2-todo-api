const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true,
    trim:true,
    minlength:1,
    unique:true,
    validate:{
      validator:validator.isEmail,
      message:'{VALUE} is not a valid email'
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
};

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
};


UserSchema.statics.findByToken = function(token) {
  var user = this;
  var decoded;

  try{
    decoded =jwt.verify(token,'TFG123');
    console.log('decoded',decoded);
  }catch(e){
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token':token,
    'tokens.access':'auth'
  }).catch((err) => {
    return null;
  });

};

UserSchema.pre('save',function (next){
  console.log('pre');
  var user = this;

  if(user.isModified('password')){
    bcrypt.genSalt(10,(err,salt) => {
      bcrypt.hash(user.password,salt,(err,hash) => {
        console.log(hash);
        user.password = hash;
        next();
      })
    })
  }
  else{
    next();
  }
});

UserSchema.statics.findByCredentials = function(email,password) {
  var user = this;

  return User.findOne({email}).then((user) => {
      if(!user){
        return Promise.reject();
      }
      return new Promise((resolve,reject) => {
        bcrypt.compare(password,user.password,(err,res) => {
        if(!res){
          reject();
        }
        else{
          resolve(user);
        }
      });
    });
  });
};

UserSchema.methods.removeToken = function(token) {
  var user = this;

  return user.update({
    $pull: {
      tokens:{token}
    }
  });
};

var User = mongoose.model('User' , UserSchema);
module.exports = {
  User
};
