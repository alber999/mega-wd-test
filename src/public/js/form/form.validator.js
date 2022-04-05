/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
class FormValidator {
  static validatePassword (password) {
    if (password === null || password === undefined || password === "") {
      throw new PasswordValidationError("Please enter a password");
    }

    if (password.length < 6) {
      throw new PasswordValidationError("Password must be at least 6 characters long");
    }

    if (password.length > 25) {
      throw new PasswordValidationError("Password can't have more than 25 characters");
    }
  }

  static validateFile (file) {
    if (file === undefined) {
      throw new FileValidationError("Please choose a file to upload");
    }

    if (file.size > 20 * 1024 * 1024) {
      throw new FileValidationError("Max file size 20 Mb");
    }
  }
}
