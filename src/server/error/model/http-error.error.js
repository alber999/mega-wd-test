const { StatusCodes } = require("http-status-codes");

class HttpError extends Error {
  constructor (status) {
    super();
    this.status = status || StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

module.exports = HttpError;
