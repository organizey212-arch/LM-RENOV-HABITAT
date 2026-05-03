(function () {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    } else {
      document.addEventListener("DOMContentLoaded", function () {
        if (window.lucide && typeof window.lucide.createIcons === "function") {
          window.lucide.createIcons();
        }
      });
    }
  
    const toggle = document.querySelector(".menu-toggle");
    const drawer = document.querySelector(".mobile-drawer");
    const backdrop = document.querySelector(".mobile-backdrop");
    if (!toggle || !drawer || !backdrop) return;
  
    function openMenu() {
      drawer.classList.add("open");
      backdrop.classList.add("open");
      toggle.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
  
    function closeMenu() {
      drawer.classList.remove("open");
      backdrop.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  
    toggle.addEventListener("click", function () {
      if (drawer.classList.contains("open")) closeMenu();
      else openMenu();
    });
  
    backdrop.addEventListener("click", closeMenu);
  
    drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeMenu();
    });
  })();
