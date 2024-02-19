const jwt = require("jsonwebtoken");
const config = require('config')
const db = require('../../models');
const User = db.User;
const createToken = async (user) => { //creating JWT token
  const payload = {
    sub: user.id,
    username: user.username,
  };
  const token = await jwt.sign(payload, config.SECRET_KEY, {
    algorithm: "HS512",
    expiresIn: config.EXPIRES_IN,
  });
  return token;
};

const tokenCheck = async (req, res,next) => {
  try {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Invalid token. Please log-in!",
    });
    return;
  }
  jwt.verify(token, config.SECRET_KEY, async (err, decoded) => {
    if (err){ 
      res.status(401).json({
      success: false,
      message: "Invalid Token",
      });
      return;
    }
    let sub = decoded?.sub
    if(sub==undefined){
      res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
      return;
    }
    try {
      const userInfo = await User.findByPk(sub);
      if (userInfo==null) {
        res.status(401).json({
          success: false,
          message: "Invalid Token",
        });
        return;
      }
      req.user = userInfo.username;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
      return; 
    }
  });
} catch (error) {
  res.status(400).json({
    success: false,
    message: error,
  });
  return;
}
};



module.exports = {
  createToken,
  tokenCheck,
};
