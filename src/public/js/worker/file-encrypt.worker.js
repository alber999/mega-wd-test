/* eslint-disable no-undef */
importScripts("/js/util/crypto.util.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/tweetnacl/0.14.5/nacl-fast.min.js");
importScripts("https://unpkg.com/tweetnacl-util@0.15.1/nacl-util.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/asmCrypto/0.22.0/asmcrypto.min.js");

this.onmessage = (event) => {
  console.log(">>> START::WEB_WORKER[file-encrypt.worker]");
  const start = new Date().getTime();
  const { userId, password, message } = event.data;
  const { nonce, data } = CryptoUtil.encrypt({ userId, password, message });

  // comment out for test purposes just to see the decrypt works
  // const original = CryptoUtil.decrypt({userId, password, nonce, message: data});

  const end = new Date().getTime();
  console.log(`>>> END::WEB_WORKER[file-encrypt.worker]. Time: ${(end - start) / 1000}s`);
  this.postMessage({ nonce, data });
};
