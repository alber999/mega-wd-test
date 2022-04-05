/* eslint no-undef: 0 */
// eslint-disable-next-line no-unused-vars
class UploadController {
  constructor (manager) {
    this._manager = manager;
  }

  async execute ({ event, userId, password, file }) {
    if (currentOtp === undefined) {
      const { otp } = await $.ajax(OtpRequestSettingsBuilder.buildCreate(userId).toAjax());
      currentOtp = otp;
    }
    const secret = currentOtp;

    if (currentName === undefined) {
      const { name } = await $.ajax(FileRequestSettingsBuilder.buildCreate({ userId, secret, event, file }).toAjaxSecured());
      currentName = name;
    }
    const name = currentName;

    file.uuid = UuidUtil.build();
    file.mode = UploadConfig.update;
    file.newName = name;

    if (file.name !== file.newName) {
      return this._manager.onConflict({
        file,
        start: (mode) => this.start({ event, userId, password, file, secret, mode }),
        cancel: (uuid) => this.cancel(uuid)
      });
    }

    this.start({ event, userId, password, file, secret });
  }

  start ({ event, userId, password, file, secret, mode }) {
    try {
      currentOtp = undefined;
      currentName = undefined;

      file.mode = mode || UploadConfig.update;

      this._manager.onStart({
        file,
        cancel: (uuid) => this.cancel(uuid)
      });

      this._processFileEncrypt = Process.getInstance(ProcessPath.fileEncrypt)
        .send({ userId, password, message: event.target.result })
        .on((event) => {
          const fileUpdateRequestSettings = this._handleFileEncryptWorkerMessage({ event, userId, secret, file, mode });

          this._processAuthHeader = Process.getInstance(ProcessPath.authHeaders)
            .send(fileUpdateRequestSettings)
            .on((event) => {
              this._handleAuthHeadersWorkerMessage({ event, file, fileUpdateRequestSettings });
              this._processAuthHeader.terminate();
            });

          this._processFileEncrypt.terminate();
        });
    } catch (e) {
      console.error(e);
      this._manager.onError({
        file,
        reupload: (uuid) => this.reupload(uuid)
      });
    }
  }

  reupload (uuid) {
    const request = requestList.find(el => el.uuid === uuid);

    if (request !== undefined) {
      const { ajaxRequestSettings } = request;
      request.xhr = $.ajax(ajaxRequestSettings);
      this._manager.onReupload({
        uuid,
        cancel: (uuid) => this.cancel(uuid)
      });
    }
  }

  cancel (uuid) {
    const request = requestList.find(el => el.uuid === uuid);

    if (request !== undefined) {
      request.xhr.abort();
      this.removeRequest(uuid);
    }

    this._manager.onCancel(uuid);

    if (this._processFileEncrypt !== undefined) {
      this._processFileEncrypt.terminate();
    }

    if (this._processAuthHeader !== undefined) {
      this._processAuthHeader.terminate();
    }
  }

  removeRequest (uuid) {
    requestList = requestList.filter(el => el.uuid !== uuid);
  }

  _handleFileEncryptWorkerMessage ({ event, userId, secret, file, mode }) {
    const { nonce, data } = event.data;

    // eslint-disable-next-line no-undef
    if (mode === UploadConfig.update && file.name !== file.newName) {
      // eslint-disable-next-line no-undef
      $.ajax(FileRequestSettingsBuilder.buildDelete({ userId, secret, file }).toAjaxSecured());
    }

    return FileUpdateRequestSettings.prepareForAuth({ userId, secret, nonce, data, file });
  }

  _handleAuthHeadersWorkerMessage ({ event, file, fileUpdateRequestSettings }) {
    const headers = event.data;
    const ajaxRequestSettings = FileRequestSettingsBuilder.buildUpdate({
      fileUpdateRequestSettings,
      onProgress: (progress) => this._manager.onProgress({ file, progress }),
      success: () => {
        this.removeRequest(file.uuid);
        this._manager.onSuccess(file);
      },
      error: () => this._manager.onError({
        file,
        reupload: (uuid) => this.reupload(uuid)
      })
    }).toAjaxWithHeaders(headers);

    requestList.push({
      uuid: file.uuid,
      ajaxRequestSettings,
      xhr: $.ajax(ajaxRequestSettings)
    });
  }
}
