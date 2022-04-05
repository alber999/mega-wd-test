class ApiAliveRouterBuilder {
  constructor ({ router, handler }) {
    this._router = router;
    this._handler = handler;
  }

  build () {
    this._router.get("/", (req, res) => this._handler.get({ req, res }));

    return this._router;
  }
}

module.exports = ApiAliveRouterBuilder;
