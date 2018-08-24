const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');


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
