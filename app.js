const express = require('express');
const sequelize = require('./util/database');
const Todolist = require('./models/todolist');
const User = require('./models/user');

const app = express();

app.use(express.urlencoded());
app.use(express.json());

const todolistRoute = require('./routes/todo');
const authRoutes = require('./routes/auth');
const isAuth = require('./middleware/is_auth');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api', isAuth,todolistRoute);


Todolist.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Todolist);

sequelize
  .sync()
  .then(result => {
    app.listen(3000);
    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });