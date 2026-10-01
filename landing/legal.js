/* Preenche o e-mail de contato das páginas legais a partir de config.js */
(function () {
  var c = window.SU_CONFIG || {}, e = c.CONTACT_EMAIL;
  var ok = typeof e === "string" && e.length > 0 && e.indexOf("SEU-") === -1;
  document.querySelectorAll(".js-email").forEach(function (a) {
    if (ok) { a.textContent = e; a.href = "mailto:" + e; }
    else { a.textContent = "[defina CONTACT_EMAIL em config.js]"; a.removeAttribute("href"); }
  });
  var y = document.getElementById("y"); if (y) y.textContent = new Date().getFullYear();
})();
