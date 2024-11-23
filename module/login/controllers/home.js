const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const secretkey = "srawra";
const path = require('path');

router.get('/', verifyToken, (req, res) => {
    jwt.verify(req.token, secretkey, (err, decoded) => {
        if (err) {
            res.sendStatus(403); // Forbidden
        } else {
            res.sendFile(path.join(__dirname, '../Client/home.html'));
        }
    });
});

function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      // Next middleware
      next();
    } else {
      // Forbidden
      res.send({ result: "no login" });
    }
}

module.exports = router;
