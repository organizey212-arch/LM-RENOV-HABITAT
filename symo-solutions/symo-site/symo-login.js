import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const url = typeof window !== "undefined" ? window.__SYMO_SUPABASE_URL || "" : "";
const key = typeof window !== "undefined" ? window.__SYMO_SUPABASE_ANON_KEY || "" : "";

const form = document.getElementById("login-form");
const msg = document.getElementById("login-feedback");
const successBox = document.getElementById("login-success");
const emailLabel = document.getElementById("login-user-email");
const logoutBtn = document.getElementById("logout-btn");

function showErr(t) {
  if (!msg) return;
  msg.hidden = false;
  msg.textContent = t;
}

function clearErr() {
  if (!msg) return;
  msg.hidden = true;
}

function showSuccess(user) {
  if (form) form.hidden = true;
  if (successBox) {
    successBox.hidden = false;
    if (emailLabel) emailLabel.textContent = user?.email ?? "—";
  }
}

function showForm() {
  if (form) form.hidden = false;
  if (successBox) successBox.hidden = true;
}

if (!url || !key) {
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      showErr(
        "Variables Supabase manquantes : renseignez dashboard/.env.local (VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY), puis relancez npm run sync-symo."
      );
    });
  }
} else {
  const supabase = createClient(url, key);

  supabase.auth.getSession().then(function (res) {
    var u = res.data.session?.user;
    if (u) showSuccess(u);
  });

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      clearErr();
      var emailEl = document.getElementById("login-email");
      var passEl = document.getElementById("login-password");
      var email = emailEl ? String(emailEl.value || "").trim() : "";
      var password = passEl ? String(passEl.value || "") : "";
      if (!email || !password) {
        showErr("E-mail et mot de passe requis.");
        return;
      }
      var out = await supabase.auth.signInWithPassword({ email: email, password: password });
      if (out.error) {
        showErr(out.error.message);
        return;
      }
      var user = out.data.user ?? (await supabase.auth.getUser()).data.user;
      showSuccess(user);
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async function () {
      await supabase.auth.signOut();
      showForm();
      clearErr();
    });
  }
}
