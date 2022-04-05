// eslint-disable-next-line no-unused-vars
class Process {
  static getInstance (path) {
    if (typeof (Worker) !== "undefined") {
      return new Process(new Worker(path));
    }

    throw Error("Workers not supported");
  }

  constructor (worker) {
    this._worker = worker;
  }

  send (data) {
    if (this._worker !== undefined) {
      this._worker.postMessage(data);
    }
    return this;
  }

  on (handler) {
    if (this._worker !== undefined) {
      this._worker.onmessage = event => handler(event);
    }
    return this;
  }

  terminate () {
    if (this._worker !== undefined) {
      this._worker.terminate();
      this._worker = undefined;
    }
  }
}
