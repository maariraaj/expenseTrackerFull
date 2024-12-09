const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token, 'a2b8d9f3e4c5d6a1b7e2c3d4f5e6a7b8c9d0f1e6e7f8a9b0c1d2e3f');
        User.findByPk(user.userId)
            .then(user => {
                //console.log(JSON.stringify(user));
                req.user = user;
                next();
            })
            .catch(err => { throw new Error(err) });
    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false });
    }
};