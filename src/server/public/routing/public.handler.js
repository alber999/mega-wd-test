class PublicHandler {
  get ({ req, res, indexFileName }) {
    res.render(indexFileName);
  }
}

module.exports = PublicHandler;
