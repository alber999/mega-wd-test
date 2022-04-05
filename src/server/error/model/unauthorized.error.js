const { StatusCodes } = require("http-status-codes");
const HttpError = require("./http-error.error");

class UnauthorizedError extends HttpError {
  constructor () {
    super(StatusCodes.UNAUTHORIZED);
  }
}

module.exports = UnauthorizedError;
