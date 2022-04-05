const { StatusCodes } = require("http-status-codes");
const HttpError = require("./http-error.error");

class BadRequestError extends HttpError {
  constructor () {
    super(StatusCodes.BAD_REQUEST);
  }
}

module.exports = BadRequestError;
