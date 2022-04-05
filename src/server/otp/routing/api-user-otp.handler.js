const { StatusCodes } = require("http-status-codes");

class ApiUserOtpHandler {
  constructor (otpService) {
    this._otpService = otpService;
  }

  post ({ req, res }) {
    const otp = this._otpService.create();
    res.status(StatusCodes.CREATED).send({ otp });
  }
}

module.exports = ApiUserOtpHandler;
