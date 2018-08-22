const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


/*
//Delte all
Todo.remove({}).then((result) => {
  console.log(result);
}).catch((err) => {
  console.log('enable to delete all',err);
});

//Delete FindOne and remove
Todo.findOneAndRemove({text:'Vineet'}).then((todo) => {
  console.log(todo);
}).catch((err) => {
  console.log('Could not delete',err);
})
*/

//Detele by ID
/*
Todo.findByIdAndRemove({_id: '5b794c0a1f5859702878b357'}).then((todo) => {
  console.log(todo);
}).catch((err) => {
  console.log(err);
});
*/


//Detele by ID
Todo.findByIdAndRemove('5b7a203ffba56e98a0671d15').then((todo) => {
  console.log(todo);
}).catch((err) => {
  console.log(err);
})
