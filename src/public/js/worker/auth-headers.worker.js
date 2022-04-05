/* eslint-disable no-undef */
importScripts("/js/auth/auth-headers.builder.js");
importScripts("/js/util/crypto.util.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/tweetnacl/0.14.5/nacl-fast.min.js");
importScripts("https://unpkg.com/tweetnacl-util@0.15.1/nacl-util.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/asmCrypto/0.22.0/asmcrypto.min.js");

this.onmessage = (event) => {
  console.log(">>> START::WEB_WORKER[auth-headers.worker]");
  const start = new Date().getTime();
  const { secret, method, path, data } = event.data;

  const headers = new AuthHeadersBuilder({ secret, method, path, data }).build();

  const end = new Date().getTime();
  console.log(`>>> END::WEB_WORKER[auth-headers.worker]. Time: ${(end - start) / 1000}s`);
  this.postMessage(headers);
};
