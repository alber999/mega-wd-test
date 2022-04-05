const { StatusCodes } = require("http-status-codes");

class ApiAliveHandler {
  get ({ req, res }) {
    res.sendStatus(StatusCodes.OK);
  }
}

module.exports = ApiAliveHandler;
