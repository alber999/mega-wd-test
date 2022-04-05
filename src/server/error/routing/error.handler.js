const HttpError = require("../model/http-error.error");

class ErrorHandler {
  static handle ({ err, req, res, next }) {
    if (err instanceof HttpError) {
      return res.sendStatus(err.status);
    }

    console.error(err);
    res.status(new HttpError().status).send("Something went wrong!");
  }
}

module.exports = ErrorHandler;
