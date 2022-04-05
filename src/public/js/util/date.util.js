/* eslint-disable no-unused-vars */
class DateUtil {
  static build () {
    let date = new Date();
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - (offset * 60 * 1000));
    return date.toISOString().split("T")[0];
  }
}
