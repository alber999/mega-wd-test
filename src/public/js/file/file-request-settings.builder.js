// eslint-disable-next-line no-unused-vars
class FileRequestSettingsBuilder {
  static buildCreate ({ userId, secret, event, file, success, error }) {
    // eslint-disable-next-line no-undef
    return new RequestSettings({
      secret,
      method: "POST",
      path: `/api/user/${userId}/file`,
      data: {
        name: file.name
      },
      success,
      error
    });
  }

  static buildUpdate ({ fileUpdateRequestSettings, onProgress, success, error }) {
    // eslint-disable-next-line no-undef
    return new RequestSettings({
      secret: fileUpdateRequestSettings.secret,
      method: fileUpdateRequestSettings.method,
      path: fileUpdateRequestSettings.path,
      data: fileUpdateRequestSettings.data,
      xhr: () => {
        const xhr = new window.XMLHttpRequest();

        xhr.upload.addEventListener("progress", (evt) => {
          if (evt.lengthComputable) {
            const progress = parseInt(((evt.loaded / evt.total) * 100), 10);
            onProgress(progress);
          }
        }, false);

        return xhr;
      },
      success,
      error
    });
  }

  static buildDelete ({ userId, secret, file }) {
    // eslint-disable-next-line no-undef
    return new RequestSettings({
      secret,
      method: "DELETE",
      path: `/api/user/${userId}/file`,
      data: {
        name: file.newName
      }
    });
  }
}
