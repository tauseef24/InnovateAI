export default defineNuxtPlugin(() => {
  window.$crisp = [];
  window.CRISP_WEBSITE_ID = "72e6995a-cff1-4481-8064-3b1e9b04cd7e";

  (function () {
    var d = document;
    var s = d.createElement("script");

    s.src = "https://client.crisp.chat/l.js";
    s.async = 1;
    d.getElementsByTagName("head")[0].appendChild(s);
  })();
});
