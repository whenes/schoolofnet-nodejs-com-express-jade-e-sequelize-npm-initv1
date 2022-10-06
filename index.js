const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride(function(req, res) {
  if (req.body && typeof req.body == 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

const sequelize = new Sequelize('mysql://root:12345678@localhost:3306/express_jade_mysql');

const User = sequelize.define('User', {
  name: Sequelize.STRING,
  lastname: Sequelize.STRING
});

// User.sync({ force: true }).then(function() { //forçar criação da tabela
User.sync().then(function() {
  // return User.create({
  //   name: 'Whenes8',
  //   lastname: 'Oliveira8'
  // });
});

app.delete('/users/:id', function(req, res) {
  User.destroy({ where: { id: req.params.id } }).then(function() {
    res.redirect('/users');
  }).catch(function(err) { console.log(err) }); 
});

app.get('/users/edit/:id', function(req, res) {
  User.findByPk(req.params.id).then(function(result) {
    res.render('edit_users', {
      message: 'Edit user',
      data: result
    });
  }).catch(function(req, res) { console.log(err) });
});
app.put('/users/edit/:id', function(req, res) {
  User.update(req.body, { where: { id: req.params.id } }).then(function(result) {
    res.redirect('/users');
  }).catch(function(err) { console.log(err) });
});

app.get('/users/create', function(req, res) {
  res.render('new_users', {
    message: 'Create user'
  });
});
app.post('/users/create', function(req, res) {
  User.create(req.body).then(function() {
    res.render('new_users', {
      message: 'Create User'
    })
  }).catch(function(err) { console.log(err) });
});

app.get('/users/:id', function(req, res) {
  if (req.params.id % 2 == 0) {
    User.findOne({ where: { id: req.params.id} })
      .then(function(result) {
        res.render('user', {
          data: result,
          message: 'Find One User'
        })
      })
      .catch(function(err) { console.log(err) });
    } else {
    User.findByPk(req.params.id)
    .then(function(result) {
        res.render('user', {
          data: result,
          message: 'Find By PK/ID User'
        })
      })
      .catch(function(err) { console.log(err) });
  }
});

app.get('/users', function(req, res) {
  User.findAll().then(function(result) {
    res.render('users', {
      data: result,
      message: 'List of Users'
    })
  }).catch(function(err) { console.log(err) });
});

app.get('/', function(req, res) {
  res.render('index', {
    message: 'Hello parametro',
    count: 7
  });
});

app.listen(3000, '127.0.0.1', function() {
  console.log('Express has been started on port http://localhost:3000');
});