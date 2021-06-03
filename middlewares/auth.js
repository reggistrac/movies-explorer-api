const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'very-secret-key' } = process.env;

module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt;
  if (!authorization) {
    return next({ statusCode: 401, errMess:"Нет токена."});
  }

  let payload;
  try {
    payload = jwt.verify(authorization, JWT_SECRET);
  } catch (err) { return next({ statusCode: 401,errMess:"Токен инвалид." }); }
  req.id = payload;
  next();
  return 'Ok';
};
