/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
class CryptoUtil {
  get entropy () {
    return btoa("my_entropy");
  }

  static hash ({ secret, message }) {
    return btoa(CryptoJS.HmacSHA512(message, secret));
  }

  static encrypt ({ userId, password, message }) {
    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
    return {
      nonce: nacl.util.encodeBase64(nonce),
      data: nacl.util.encodeBase64(
        nacl.secretbox(
          nacl.util.decodeUTF8(message),
          nonce,
          this._generateKey({ userId, password })
        )
      )
    };
  }

  static decrypt ({ userId, password, nonce, message }) {
    return nacl.util.encodeUTF8(
      nacl.secretbox.open(
        nacl.util.decodeBase64(message),
        nacl.util.decodeBase64(nonce),
        this._generateKey({ userId, password })
      )
    );
  }

  static _generateKey ({ userId, password }) {
    const salt = userId + this.entropy;

    const iterations = 65536;
    const dklen = 32;

    return asmCrypto.PBKDF2_HMAC_SHA256.bytes(password, salt, iterations, dklen);
  }
}
