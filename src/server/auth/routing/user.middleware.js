const _ = require("lodash");
const NotFoundError = require("../../error/model/not-found.error");

class UserMiddleware {
  constructor (otpService) {
    this._otpService = otpService;
  }

  handle ({ req, res, next }) {
    const { userId } = req.params;
    if (_.isEmpty(userId)) {
      throw new NotFoundError();
    }

    req.userId = userId;
    next();
  }
}

module.exports = UserMiddleware;
