// eslint-disable-next-line no-unused-vars
class FileUpdateRequestSettings {
  static prepareForAuth ({ userId, secret, nonce, data, file }) {
    return {
      secret,
      method: "PUT",
      path: `/api/user/${userId}/file`,
      data: {
        // eslint-disable-next-line no-undef
        name: file.mode === UploadConfig.update ? file.name : file.newName,
        type: file.type,
        size: file.size.toString(),
        nonce,
        data
      }
    };
  }
}
