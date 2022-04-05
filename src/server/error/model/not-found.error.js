const { StatusCodes } = require("http-status-codes");
const HttpError = require("./http-error.error");

class NotFoundError extends HttpError {
  constructor () {
    super(StatusCodes.NOT_FOUND);
  }
}

module.exports = NotFoundError;
