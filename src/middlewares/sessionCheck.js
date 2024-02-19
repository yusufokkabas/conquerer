const APIError = require("../utils/errors");

const sessionCheck = (req, res, next) => { //middleware to check if user is logged in and session is valid.
  if (!req.session || !req.session.userId) {
    throw new APIError("Invalid session. Please log-in!", 401);
  }
  next();
};

module.exports = sessionCheck;