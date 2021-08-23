const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        res.status(401).json({ message: 'not authenticated' });
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'secret');
    } catch (err) {
        res.status(401).json({ message: 'not authenticated' });
    }
    if (!decodedToken) {
        res.status(401).json({ message: 'not authenticated' });
    }

    await User.findByPk(decodedToken.userId)
        .then(user => {
            req.user = user;
        })
        .catch(err => console.log(err));

    next();
};
