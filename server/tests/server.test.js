const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text:'first todo'
},
{
  _id: new ObjectID(),
  text:'second todo'
}];

beforeEach((done => {
  Todo.remove({}).then(() => {
    //done();
    return Todo.insertMany(todos);
  }).then(() => {
    done();
  }).catch((err) => {
    console.log('Error running beforeEach',err);
  })
}))

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
