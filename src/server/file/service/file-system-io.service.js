const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const ArrayUtil = require("../../util/array.util");

class FileSystemIOService {
  constructor (path) {
    this._path = path;
  }

  exists ({ userId, name }) {
    return fs.existsSync(this._filePath({ userId, name }));
  }

  save ({ userId, name, data }) {
    name = this._cleanFileName(name);
    const dirPath = this._dirPath(userId);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFile(
      this._filePath({ userId, name }),
      data || "",
      "",
      err => {
        if (err) {
          throw Error(err);
        }
      });
  }

  remove ({ userId, name }) {
    fs.unlink(
      this._filePath({ userId, name }),
      err => {
        if (err) {
          console.error(err);
        }
      });
  }

  lookupNewName ({ userId, name }) {
    const regExp = new RegExp("^" + name + " \\((\\d+)\\)$", "g");
    const matches = fs.readdirSync(this._dirPath(userId))
      .filter(paths => paths.match(regExp) !== null)
      .map(el => +el.replace(regExp, "$1"));

    const fileIndex = _.isEmpty(matches) ? 1 : ArrayUtil.firstNextNumber(matches);
    return `${name} (${fileIndex})`;
  }

  _cleanFileName (name) {
    return name.trim();
  }

  _dirPath (userId) {
    return path.join(this._path, userId);
  }

  _filePath ({ userId, name }) {
    return path.join(this._dirPath(userId), name);
  }
}

module.exports = FileSystemIOService;
