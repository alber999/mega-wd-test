class ApiUserFileRouterBuilder {
  constructor ({ router, handler, maxSizeMb }) {
    this._router = router;
    this._handler = handler;
    this._maxSizeMb = maxSizeMb;
  }

  build () {
    this._router.post("/", (req, res) => this._handler.post({ req, res }));
    this._router.put("/", (req, res) => this._handler.put({ req, res }));
    this._router.delete("/", (req, res) => this._handler.delete({ req, res }));

    return this._router;
  }
}

module.exports = ApiUserFileRouterBuilder;
