(function () {
  var SUPABASE_ESM = "https://esm.sh/@supabase/supabase-js@2.49.1";

  function symoDashboardOrigin() {
    var p = location.protocol;
    var h = location.hostname;
    var port = location.port;
    var local =
      h === "localhost" ||
      h === "127.0.0.1" ||
      h === "::1" ||
      p === "file:";
    if (local && port !== "5173" && port !== "4173") {
      return "http://localhost:5173";
    }
    return "";
  }

  function symoDashUrl(path) {
    if (!path || path.charAt(0) !== "/") return path;
    var o = symoDashboardOrigin();
    if (path === "/login" && o) {
      return o + "/dashboard/login";
    }
    return o ? o + path : path;
  }

  function loginPathFromEl(el) {
    if (el && el.getAttribute) {
      var t = el.getAttribute("data-nav-target");
      if (t && t.charAt(0) === "/") return t;
      var tag = el.tagName ? String(el.tagName).toLowerCase() : "";
      if (tag === "a") {
        var h = el.getAttribute("href");
        if (h && h.charAt(0) === "/" && h.indexOf(":") === -1) {
          return (h.split("?")[0] || "").split("#")[0];
        }
      }
    }
    return "/login";
  }

  function closeMobileNav() {
    var backdrop = document.getElementById("mobile-nav-backdrop");
    var panel = document.getElementById("mobile-nav-panel");
    var toggle = document.getElementById("mobile-nav-toggle");
    if (!backdrop || !panel || !toggle) return;
    backdrop.classList.remove("is-open");
    panel.classList.remove("is-open");
    backdrop.setAttribute("aria-hidden", "true");
    panel.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("mobile-nav-lock");
  }

  function goAccesClient(sourceEl) {
    var loginFull = symoDashUrl(loginPathFromEl(sourceEl));
    var dashHome = symoDashUrl("/dashboard/");
    var url = window.__SYMO_SUPABASE_URL;
    var key = window.__SYMO_SUPABASE_ANON_KEY;

    if (!url || !key) {
      window.location.href = loginFull;
      return;
    }

    import(SUPABASE_ESM)
      .then(function (mod) {
        var supabase = mod.createClient(url, key);
        return supabase.auth.getSession();
      })
      .then(function (res) {
        var session = res && res.data && res.data.session;
        window.location.href = session ? dashHome : loginFull;
      })
      .catch(function () {
        window.location.href = loginFull;
      });
  }

  function bindAccesClientIntercepts() {
    document.querySelectorAll("a.btn-nav-acces-desktop").forEach(function (a) {
      a.addEventListener("click", function (e) {
        if (e.button !== 0) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        goAccesClient(a);
      });
    });

    document.querySelectorAll("button.btn-mobile-client").forEach(function (btn) {
      btn.addEventListener("click", function () {
        closeMobileNav();
        goAccesClient(btn);
      });
    });
  }

  bindAccesClientIntercepts();

  var toggle = document.getElementById("mobile-nav-toggle");
  var panel = document.getElementById("mobile-nav-panel");
  var backdrop = document.getElementById("mobile-nav-backdrop");
  if (!toggle || !panel || !backdrop) return;

  var closeBtn = panel.querySelector(".mobile-nav-close");

  function isOpen() {
    return backdrop.classList.contains("is-open");
  }

  function open() {
    backdrop.classList.add("is-open");
    panel.classList.add("is-open");
    backdrop.setAttribute("aria-hidden", "false");
    panel.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("mobile-nav-lock");
  }

  toggle.addEventListener("click", function () {
    if (isOpen()) closeMobileNav();
    else open();
  });
  if (closeBtn) closeBtn.addEventListener("click", closeMobileNav);
  backdrop.addEventListener("click", closeMobileNav);

  panel.querySelectorAll(".mobile-nav-list a").forEach(function (a) {
    a.addEventListener("click", closeMobileNav);
  });
  panel
    .querySelectorAll(".mobile-nav-footer-actions button[data-nav-target]:not(.btn-mobile-client)")
    .forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-nav-target");
        closeMobileNav();
        if (target) window.location.href = target;
      });
    });
  panel.querySelectorAll(".mobile-nav-footer-actions a").forEach(function (a) {
    a.addEventListener("click", closeMobileNav);
  });

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) closeMobileNav();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 720 && isOpen()) closeMobileNav();
  });
})();
