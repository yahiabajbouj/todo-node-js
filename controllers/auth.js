const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ message: 'Validation failed', errors: errors.errors });
  } else {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt
      .hash(password, 12)
      .then(hashedPw => {
        console.log("hashedPw : " + hashedPw);
        User.create({
          email: email,
          password: hashedPw,
          name: name
        }).then(result => {
          res.status(200).json({ message: 'User created!', userId: result._id });
        })
          .catch(err => {
            console.log(err);
          });;
      }).catch(err => {
        console.log(err);
      });
  }

};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User
    .findAll({
      where: {
        email: email
      }
    })
    .then(user => {
      if (!user) {
        res.status(404).json({ token: "email not found" });
      }
      loadedUser = user[0];
      return bcrypt.compare(password, user[0].password);
    })
    .then(isEqual => {
      if (!isEqual) {
        res.status(401).json({ token: "password is wrong" });
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser.id.toString()
        },
        'secret',
        { expiresIn: '1d' }
      );
      res.status(200).json({ user: loadedUser, token: token });
    })
    .catch(err => {
      console.log(err);
    });
};
