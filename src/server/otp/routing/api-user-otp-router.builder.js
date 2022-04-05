class ApiUserOtpRouterBuilder {
  constructor ({ router, handler }) {
    this._router = router;
    this._handler = handler;
  }

  build () {
    this._router.post("/", (req, res) => this._handler.post({ req, res }));

    return this._router;
  }
}

module.exports = ApiUserOtpRouterBuilder;
