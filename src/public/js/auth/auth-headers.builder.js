// eslint-disable-next-line no-unused-vars
class AuthHeadersBuilder {
  constructor ({ secret, method, path, data }) {
    this._secret = secret;
    this._method = method;
    this._path = path;
    this._data = data;
  }

  build () {
    const timestamp = new Date().getTime();
    // eslint-disable-next-line no-undef
    const nonce = this._buildNonce();
    // eslint-disable-next-line no-undef
    const signature = this._buildHmacSignature({
      timestamp,
      nonce
    });

    return { timestamp, nonce, signature };
  }

  _buildNonce () {
    // eslint-disable-next-line no-undef
    return btoa(nacl.randomBytes(nacl.secretbox.nonceLength));
    // return nacl.util.encodeBase64(nacl.randomBytes(nacl.secretbox.nonceLength))
  }

  _buildHmacSignature ({ timestamp, nonce }) {
    const plainDigest =
            this._method +
            encodeURI(this._path) +
            timestamp +
            nonce +
            JSON.stringify(this._data);

    // eslint-disable-next-line no-undef
    return CryptoUtil.hash({
      secret: this._secret,
      message: plainDigest
    });
  }
}
