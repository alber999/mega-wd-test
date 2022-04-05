/* eslint-disable no-unused-vars */
class UuidUtil {
  static build () {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
