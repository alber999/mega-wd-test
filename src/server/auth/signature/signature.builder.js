const cryptoJs = require("crypto-js");

class SignatureBuilder {
  constructor ({ secret, timestamp, nonce, method, path, data }) {
    this._secret = secret;
    this._timestamp = timestamp;
    this._nonce = nonce;
    this._method = method;
    this._path = path;
    this._data = data;
  }

  build () {
    const plainDigest =
            this._method +
            encodeURI(this._path) +
            this._timestamp +
            this._nonce +
            JSON.stringify(this._data);

    return btoa(cryptoJs.HmacSHA512(plainDigest, this._secret));
  }
}

module.exports = SignatureBuilder;
