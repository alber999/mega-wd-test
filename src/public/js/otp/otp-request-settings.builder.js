// eslint-disable-next-line no-unused-vars
class OtpRequestSettingsBuilder {
  static buildCreate (userId) {
    // eslint-disable-next-line no-undef
    return new RequestSettings({
      method: "POST",
      path: `/api/user/${userId}/otp`
    });
  }
}
