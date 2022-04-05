const express = require("express");

class ApiPublicRouterBuilder {
  constructor ({ router, handler, path, indexFileName }) {
    this._router = router;
    this._handler = handler;
    this._path = path;
    this._indexFileName = indexFileName;
  }

  build () {
    this._router.use("/", express.static(this._path));
    this._router.get("/", (req, res) => this._handler.get({ req, res, indexFileName: this._indexFileName }));

    return this._router;
  }
}

module.exports = ApiPublicRouterBuilder;
