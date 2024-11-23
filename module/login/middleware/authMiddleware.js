// function verifyToken(req, res, next) {
//     // Get auth header value
//     const bearerHeader = req.headers['authorization'];
//     // Check if bearer is undefined
//     if (typeof bearerHeader !== 'undefined') {
//       // Split at the space
//       const bearer = bearerHeader.split(' ');
//       // Get token from array
//       const bearerToken = bearer[1];
//       // Set the token
//       req.token = bearerToken;
//       // Next middleware
//       next();
//     } else {
//       // Forbidden
//       res.send({ result: "no login" });
//     }
// }

// module.exports = {
//     verifyToken
// };
const jwt = require('jsonwebtoken');
const secretkey = process.env.secretkey || "sarwar";

function jwtverification(req, res, next) {
    const bearerHeader = req.headers['authorization'];
        
    if (!bearerHeader) {
      
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
  
    const tokenParts = bearerHeader.split(' ');
  
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
      
      return res.status(401).json({ error: "Unauthorized: Invalid token format" });
    }
  
    const token = tokenParts[1];
    
    jwt.verify(token, secretkey, (err, decoded) => {
      if (err) {
        
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }
      
      req.user = decoded.user; // Attach decoded user information to request
      next();
    });
  }
  
module.exports = {
    jwtverification
};
