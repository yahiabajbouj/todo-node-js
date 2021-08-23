const TodoList = require('../models/todolist');
const { validationResult } = require('express-validator/check');

exports.getAllTodoList = (req, res, next) => {
  req.user
    .getTodolists()
    .then(Todos => {
      res.status(200).json({
        message: 'Fetched Todos successfully.',
        todos: Todos,
      });
    })
    .catch(err => console.log(err));
};

exports.getSingleTodoList = (req, res, next) => {
  const TodoId = req.params.TodoId;
  req.user
    .getTodolists({
      where: {
        id: TodoId
      }
    })
    .then(Todos => {
      const Todo = Todos[0];
      if (!Todo) {
        TodoList.findByPk(TodoId).then(result => {
          if (result) {
            res.status(401).json({
              message: 'Not Authorized',
            });
          } else {
            res.status(404).json({
              message: 'Todo Not Found',
            });
          }
        });
      } else {
        res.status(200).json({
          message: 'Fetched Todo successfully.',
          todos: Todo,
        });
      }
    })
    .catch(err => console.log(err));
};

exports.addTodoList = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ message: 'Validation failed', errors: errors.errors });
  }
  const title = req.body.title;
  const description = req.body.description;

  req.user
    .createTodolist({
      title: title,
      description: description,
    })
    .then(Todo => {
      res.status(200).json({
        message: 'Add Todo successfully.',
        todo: Todo,
      });
      console.log('Created Product');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.putEditProduct = (req, res, next) => {
  const TodoId = req.params.TodoId;
  const updatedTitle = req.body.title;
  const updatedDesc = req.body.description;
  req.user
    .getTodolists({
      where: {
        id: TodoId
      }
    })
    .then(Todos => {
      const Todo = Todos[0];
      if (!Todo) {
        res.status(404).json({
          message: 'Todo Not Found',
        });
      } else {
        Todo.title = updatedTitle;
        Todo.description = updatedDesc;
        return Todo.save();
      }
    })
    .then(Todo => {
      res.status(200).json({
        message: 'Updated Todo successfully',
        todos: Todo,
      });
    })
    .catch(err => console.log(err));
};


exports.postDeleteProduct = (req, res, next) => {
  const TodoId = req.params.TodoId;
  req.user
    .getTodolists({
      where: {
        id: TodoId
      }
    })
    .then(Todos => {
      const Todo = Todos[0];
      if (!Todo) {
        res.status(404).json({
          message: 'Todo Not Found',
        });
      }else{
        return Todo.destroy();
      }
    })
    .then(Todo => {
      res.status(200).json({
        message: 'Destroyed Todo successfully',
      });
    })
    .catch(err => console.log(err));
};