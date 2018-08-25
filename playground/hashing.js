const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//Passwrd hashing
var password = 'vineet';

bcrypt.genSalt(10,(err,salt) => {
  bcrypt.hash(password,salt,(err,hash)=>{
    console.log('hash info',hash);
  });
});

var password1 = '$2a$10$GuqqB00yhf28P7hwxLrQJudUCT.4rmzsQlb/fOSpKxBiX9WyYjcQW';
var password2 = '$2a$10$iKM/3W5r5eVVgX0ngAlzeukdZpXEm/7bhe6qQiL/PEbc26hjUUkzG';

bcrypt.compare(password,password1,(err,res) => {
  console.log(res);
});

bcrypt.compare(password,password2,(err,res) => {
  console.log(res);
});


//javawebtokensauthentication

var maindata = {
  id:15
};

var token = jwt.sign(maindata,'mysecret');

console.log('JWT token is:',token);

var decoded_Token = jwt.verify(token,'mysecret');
console.log('decoded tocken is:',decoded_Token);


//Manual SHA256 usage

var message = 'Vineet Panwar' ;
console.log('Message',SHA256(message).toString());


var data = {
  id:4
}

var token = {
  data,
  hash:SHA256(JSON.stringify(data) + 'SecretKey').toString()
}

//token.data.id = 5;
//token.hash = SHA256(JSON.stringify(data)).toString();


var hashresult = SHA256(JSON.stringify(token.data) + 'SecretKey').toString();

if(hashresult === token.hash){
  console.log('We can trust on him');
}
else{
  console.log('We dont trust on him');
}
