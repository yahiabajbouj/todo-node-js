const express = require('express');
const { body } = require('express-validator/check');
const todoController = require('../controllers/todo');
const router = express.Router();

router.get('/todoList', todoController.getAllTodoList);

router.get('/todoList/:TodoId', todoController.getSingleTodoList);

router.post('/todoList', [
    body('title').not().isEmpty(),
    body('description').not().isEmpty()
], todoController.addTodoList);

router.put('/todoList/:TodoId',  todoController.putEditProduct);

router.delete('/todoList/:TodoId', todoController.postDeleteProduct);

module.exports = router;
