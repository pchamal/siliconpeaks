(function () {
  var root = document.documentElement;
  try {
    var saved = localStorage.getItem("sp-theme");
    if (saved === "night" || saved === "day") root.setAttribute("data-theme", saved);
    else root.setAttribute("data-theme", "day");
  } catch (e) {
    root.setAttribute("data-theme", "day");
  }
  var btn = document.getElementById("mode-toggle");
  if (!btn) return;
  btn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "night" ? "day" : "night";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("sp-theme", next); } catch (e) {}
    btn.setAttribute("aria-pressed", next === "night" ? "true" : "false");
  });
  btn.setAttribute("aria-pressed", root.getAttribute("data-theme") === "night" ? "true" : "false");
})();
