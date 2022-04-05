const UnauthorizedError = require("../../error/model/unauthorized.error");
const SignatureBuilder = require("../signature/signature.builder");

class AuthMiddleware {
  constructor (otpService) {
    this._otpService = otpService;
  }

  handle ({ req, res, next }) {
    const { method, baseUrl, headers, body } = req;
    const { timestamp, nonce, signature } = headers;

    const expectedSignature = new SignatureBuilder({
      secret: this._otpService.retrieve(),
      timestamp,
      nonce,
      method,
      path: baseUrl,
      data: body
    }).build();

    if (signature !== expectedSignature) {
      throw new UnauthorizedError();
    }
    next();
  }
}

module.exports = AuthMiddleware;
