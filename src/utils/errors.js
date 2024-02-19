class APIError extends Error {
  //error handler
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 400;
  }
}

module.exports = APIError;
