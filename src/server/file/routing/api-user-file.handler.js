const _ = require("lodash");
const { StatusCodes } = require("http-status-codes");
const BadRequestError = require("../../error/model/bad-request.error");

class ApiUserFileHandler {
  constructor (fileService) {
    this._fileService = fileService;
  }

  post ({ req, res }) {
    const { userId } = req;
    const { name } = req.body;
    if (_.isEmpty(name)) {
      throw new BadRequestError();
    }

    const newName = this._fileService.create({ userId, name });
    res.status(StatusCodes.CREATED).send({ name: newName });
  }

  put ({ req, res }) {
    const { userId } = req;
    const { name, type, size, nonce, data } = req.body;
    if (_.isEmpty(name) || _.isEmpty(size) || _.isEmpty(nonce) || _.isEmpty(data)) {
      throw new BadRequestError();
    }

    this._fileService.update({ userId, name, data });
    res.status(StatusCodes.OK).send({ name, type, size });
  }

  delete ({ req, res }) {
    const { userId } = req;
    const { name } = req.body;
    if (_.isEmpty(name)) {
      throw new BadRequestError();
    }

    this._fileService.remove({ userId, name });
    res.status(StatusCodes.OK).send();
  }
}

module.exports = ApiUserFileHandler;
