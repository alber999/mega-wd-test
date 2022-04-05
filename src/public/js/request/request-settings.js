// eslint-disable-next-line no-unused-vars
class RequestSettings {
  constructor ({ secret, method, path, data, xhr, success, error }) {
    this._secret = secret;
    this._method = method;
    this._path = path;
    this._data = data;
    this._xhr = xhr;
    this._success = success;
    this._error = error;
  }

  get url () {
    return `http://localhost:3000${this._path}`;
  }

  toAjax () {
    return {
      url: this.url,
      type: this._method,
      data: this._data,
      xhr: this._xhr,
      success: this._success,
      error: this._error
    };
  }

  toAjaxWithHeaders (headers) {
    return {
      ...this.toAjax(),
      headers
    };
  }

  toAjaxSecured () {
    return {
      ...this.toAjax(),
      // eslint-disable-next-line no-undef
      headers: new AuthHeadersBuilder({
        secret: this._secret,
        method: this._method,
        path: this._path,
        data: this._data
      }).build()
    };
  }
}
