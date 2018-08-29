const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos,populateTodos,users,populateUsers} = require('./seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('Post/todos' ,() => {
  it('should create a new Todo', (done) => {
    var text = 'Test todo text';
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err,res) => {
        if(err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err) => {
          done(err);
        });
      });
  });



  it('should not create todo with invalid body', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err,res) => {
        if(err){
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((err) => {
          done(err);
        });
      });
  });

});

describe('Get /todos',() => {
  it('Should get all Todos',(done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

console.log(todos[0].text);

describe('Get/Todos/:TodoID',() => {
  console.log(`/todos/${todos[0]._id.toHexString()}`);
  it('Should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.Todo.text).toBe(todos[0].text)
      })
      .end(done);
  });

  it('Should return 404 if Todo not found',(done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done)
  });

  it('Should return for non-object ids',(done) => {
    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done)
  });
});

describe('Delete/todos/:TodoID',() => {
  it('should remove a Todo',(done) => {
    var HexID = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${HexID}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.Todo._id).toBe(HexID)

      }).end((err,res) => {
        if(err){
          return done(err);
        }
      Todo.findById(HexID).then((Todo) => {
        expect(Todo).toNotExist();
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('PATCH/todos/:id',() => {
  it('should update the todo',(done) => {
    var id = todos[0]._id.toHexString();
    var sendbody1 = _.pick(todos[0],['text']);
    sendbody1.completed = true;

    request(app)
      .patch(`/todos/${id}`)
      .send(sendbody1)
      .expect(200)
      .expect((res) => {
          expect(res.body.todo.text).toBe(sendbody1.text);
          expect(res.body.todo.completed).toBe(true);
          expect(res.body.todo.completedAT).toBeA('number');
      })
      .end(done);

  });
  it('should clear completedAT when the todo is not completed',(done) => {
    var id = todos[1]._id.toHexString();
    var sendbody2 = _.pick(todos[1],['text']);
    sendbody2.completed = false;
    console.log(sendbody2);

    request(app)
      .patch(`/todos/${id}`)
      .send(sendbody2)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(sendbody2.text);
        expect(res.body.todo.completed).toBe(false);
        console.log(res.body.todo.completedAT);
        expect(res.body.todo.completedAT).toNotExist();
      })
      .end(done);

  });
});

describe('Get/users/me',() => {
  it('Should return user if authenticated',(done) => {
    request(app)
      .get('/users/me')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res) =>{
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 when the user is not authenticated',(done) => {
    request(app)
      .get('/users/me')
      .set('x-auth','wergergwfwerfg')
      .expect(401)
      .expect((res) => {
        expect(res.body.id).toNotBe(users[0]._id.toHexString());
        expect(res.body.email).toNotBe(users[0].email);
      })
      .end(done);
  });

});

describe('Post/users', () => {
  it('Should create a user',(done) => {
    var email = 'Lele12panwar027@gmail.com';
    var password  = 'vineet123';
    request(app)
      .post('/users')
      .send({email,password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err) {
          return done(err)
        }
        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        });
      });
  });
  it('should return valdiation errors if request body invalid ',(done) => {
    var email = 'aefaefaefeaf';
    var password = 'qwe';
    request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .end(done)
  });
  it('should not create user if email is in use',(done) => {
    var email = 'vineetpanwar027@gmail.com';
    var password = 'userOnePass';
    request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .end(done)
  });
});

describe('POST/users/login',() => {
  it('should  login user and return auth token',(done) => {
    request(app)
      .post('/users/login')
      .send({
        email:users[1].email,
        password:users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err,res) => {
        if(err){
          return done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[0]).toInclude({
            access:'auth',
            token:res.headers['x-auth']
          });
          done();
        }).catch((err) => done(err));
      });
  });
  it('should reject invalid login',() => {
    request(app)
      .post('/users/login')
      .send({
        email:users[1].email,
        password:'abcd'
      })
      .expect(400)
      .expect((res) => {
        expect((res) => {
          expect(res.headers['x-auth']).toNotExist();
        })
      .end((err,res) => {
        if(err){
          return done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((err) => done(err));
      });
    });
  });

});
