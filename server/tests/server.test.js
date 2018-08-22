const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text:'first todo'
},
{
  _id: new ObjectID(),
  text:'second todo',
  completed:true,
  completedAT:345
}];


beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});


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
