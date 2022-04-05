const NotFoundError = require("../../error/model/not-found.error");

class FileService {
  constructor (ioService) {
    this._ioService = ioService;
  }

  create ({ userId, name, data }) {
    if (this._ioService.exists({ userId, name })) {
      name = this._ioService.lookupNewName({ userId, name });
    }

    this._ioService.save({ userId, name, data });

    return name;
  }

  update ({ userId, name, data }) {
    if (!this._ioService.exists({ userId, name })) {
      throw new NotFoundError({ userId, name });
    }

    this._ioService.save({ userId, name, data });
  }

  remove ({ userId, name }) {
    this._ioService.remove({ userId, name });
  }
}

module.exports = FileService;
