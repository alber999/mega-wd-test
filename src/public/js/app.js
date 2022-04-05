/* eslint no-undef:0 */
/* eslint-disable prefer-const */
// eslint-disable-next-line no-unused-vars
let requestList = [];
// eslint-disable-next-line no-unused-vars
let currentOtp;
// eslint-disable-next-line no-unused-vars
let currentName;

$(document).ready(() => {
  /********************/
  /* BROWSE MANAGER */
  /********************/
  const $browse = $("#browse-button");
  $browse.on("click", () => BrowseManager.onClick());

  class BrowseManager {
    static onClick () {
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        FileManager.click();
      } else {
        ErrorManager.show("Your browser is too old to support HTML5 File API");
      }
    }
  }

  const $passwordError = $("#password-error");
  const $error = $("#upload-error");

  /********************/
  /* ERROR MANAGER */
  /********************/

  // eslint-disable-next-line no-unused-vars
  class ErrorManager {
    static hide () {
      $error.addClass("hidden");
      $error.html("");
    }

    static show (message) {
      $error.removeClass("hidden");
      $error.html(message || "Something went wrong!");
    }

    static hidePassword () {
      $passwordError.addClass("hidden");
      $passwordError.html("");
    }

    static showPassword (message) {
      $passwordError.removeClass("hidden");
      $passwordError.html(message || "Something went wrong!");
    }

    static hideAll () {
      this.hide();
      this.hidePassword();
    }
  }

  /********************/
  /* FILE MANAGER */
  /********************/

  const $file = $("#file-button");
  const $fileInput = $("#file-input");

  $file.on("change", () => FileManager.onChange());

  // eslint-disable-next-line no-unused-vars
  class FileManager {
    static onChange () {
      currentOtp = undefined;
      currentName = undefined;

      if (this.val() === undefined) {
        $fileInput.val("");
      } else {
        $fileInput.val(this.val().name);
      }

      ErrorManager.hideAll();
    }

    static val () {
      return $file.get(0).files[0];
    }

    static reset () {
      $file.val("");
      $fileInput.val("");
    }

    static click () {
      $file.click();
    }
  }

  /********************/
  /* PASSWORD MANAGER */
  /********************/

  const $password = $("#password");
  const $togglePassword = $("#togglePassword");

  $togglePassword.on("click", () => PasswordManager.onClick());

  // eslint-disable-next-line no-unused-vars
  class PasswordManager {
    static val () {
      return $password.val();
    }

    static reset () {
      $password.val("");
      $togglePassword.removeClass("fa-eye-slash");
      $password.attr("type", "password");
    }

    static onClick () {
      const type = $password.attr("type") === "password" ? "text" : "password";
      $password.attr("type", type);
      $togglePassword.toggleClass("fa-eye-slash");
    }
  }

  /********************/
  /* UPLOAD MANAGER */
  /********************/

  // user ID is fixed for testing purposes
  const userId = "7e406f06-5424-4fc5-b880-1fce3ac4adc5";
  const $upload = $("#upload-button");

  $upload.on("click", async () => UploadManager.onClick());

  class UploadManager {
    static async createUploadItem ({ file, mode }) {
      mode = mode || file.mode;
      $("ul.upload-progress").prepend(`
      <li id="${file.uuid}">
        <span id="date">${DateUtil.build()}</span> 
        <span id="status" class="image-status image-status--loading"></span>
        <span id="name">${mode === UploadConfig.update ? file.name : file.newName}</span>
        <span id="progress">
          <progress max="100" value="0"></progress>
        </span>
        <span id="action" class="image-button image-button--cancel"></span>
      </li>
    `);
    }

    static async onClick () {
      try {
        ErrorManager.hideAll();

        const password = PasswordManager.val();
        const file = FileManager.val();

        FormValidator.validatePassword(password);
        FormValidator.validateFile(file);

        $upload.prop("disabled", true);

        const reader = new FileReader();
        const uploadController = new UploadController(this);
        reader.onload = (event) => uploadController.execute({ event, userId, password, file });
        reader.readAsDataURL(file);
      } catch (e) {
        if (e instanceof PasswordValidationError) {
          ErrorManager.showPassword(e.message);
        } else {
          ErrorManager.show(e.message);
        }
      }
    }

    static onStart ({ file, cancel }) {
      PasswordManager.reset();
      FileManager.reset();
      $upload.prop("disabled", false);

      let $uploadContainer = $(`li#${file.uuid}`);
      if ($uploadContainer.length === 0) {
        this.createUploadItem({ file });
        $uploadContainer = $(`li#${file.uuid}`);
      }

      const $action = $uploadContainer.find("#action");

      $action.on("click", () => cancel(file.uuid));
    }

    static onProgress ({ file, progress }) {
      $(`li#${file.uuid}`).find("progress").val(progress);
    }

    static onSuccess (file) {
      const $uploadContainer = $(`li#${file.uuid}`);
      const $status = $uploadContainer.find("#status");
      const $action = $uploadContainer.find("#action");

      $status.removeClass("image-status--loading");
      $status.addClass("image-status--success");

      $action.remove();
    }

    static onCancel (uuid) {
      const $uploadContainer = $(`li#${uuid}`);
      $uploadContainer.remove();
    }

    static onReupload ({ uuid, cancel }) {
      const $uploadContainer = $(`li#${uuid}`);
      const $status = $uploadContainer.find("#status");
      const $progress = $uploadContainer.find("progress");
      const $action = $uploadContainer.find("#action");

      $status.removeClass("image-status--canceled");
      $status.addClass("image-status--loading");

      $progress.removeClass("progress-canceled");
      $progress.val(0);

      $action.removeClass("image-button--reupload");
      $action.addClass("image-button--cancel");
      $action.prop("onclick", null).off("click");
      $action.on("click", () => cancel(uuid));
    }

    static onConflict ({ file, start, cancel }) {
      const $modal = $(".modal");
      $modal.on($.modal.BEFORE_CLOSE, (event, modal) => {
        $upload.prop("disabled", false);
      });

      $modal.html("");
      $modal.appendTo("body").modal({ fadeDuration: 100 });

      $modal.prepend(`
            <h1>Duplicate items</h1>
            <div class="content">
              <div class="header">
                <div class="sub-header">A file named "${file.name}" already exists</div>
                <div>What would you like to do?</div>
              </div>
                <div id="modal-update-upload" class="link">
                  <h2>Upload and update</h2>
                  <div class="message">
                    The file will be updated with this new version
                  </div>
                </div>
              <div id="modal-cancel-upload" class="link">
                <h2>Don't upload</h2>
                <div class="message">
                  No files will be updated. You will keep the current version
                </div>
              </div>
              <div id="modal-rename-upload" class="link">
                <h2>Upload and rename</h2>
                <div class="message">
                  The file you are uploading will be renamed as:
                </div>
                <div class="new-name">${file.newName}</div>
              </div>
            </div>
        `);

      $("#modal-update-upload").on("click", () => {
        $.modal.close();
        this.createUploadItem({ file, mode: UploadConfig.update });
        start(UploadConfig.update);
      });

      $("#modal-cancel-upload").on("click", () => {
        $.modal.close();
        cancel(file.uuid);
      });

      $("#modal-rename-upload").on("click", () => {
        $.modal.close();
        this.createUploadItem({ file, mode: UploadConfig.rename });
        start(UploadConfig.rename);
      });
    }

    static onError ({ file, reupload }) {
      const $uploadContainer = $(`li#${file.uuid}`);
      const $status = $uploadContainer.find("#status");
      const $progress = $uploadContainer.find("progress");
      const $action = $uploadContainer.find("#action");

      $progress.addClass("progress-canceled");
      $progress.val(100);

      $status.removeClass("image-status--loading");
      $status.addClass("image-status--canceled");

      $action.removeClass("image-button--cancel");
      $action.addClass("image-button--reupload");
      $action.prop("onclick", null).off("click");
      $action.on("click", () => reupload(file.uuid));
    }
  }
});
