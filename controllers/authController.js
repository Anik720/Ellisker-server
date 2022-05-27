const jwt=require('jsonwebtoken')
const verifyJWT=(req, res, next)=> {
  const authHeader = req.headers.authorization;
  console.log()
  if (!authHeader) {
    return res.status(401).send({ message: 'UnAuthorized access' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, 'anik', function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: 'Forbidden access' })
    }
    req.decoded = decoded;
    next();
  });
}

module.exports=verifyJWT