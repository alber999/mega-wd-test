class OtpService {
  get otp () {
    // One-Time-Password (OTP) will be fixed for testing purposes
    // this should be managed in a persistence layer, key-value store, db...
    return "fixed_otp";
  }

  retrieve () {
    return this.otp;
  }

  create () {
    return this.otp;
  }
}

module.exports = OtpService;
