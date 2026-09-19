/**
 * admin-auth.js — shared login/logout/route-protection logic for every admin
 * page. Include this AFTER supabase-config.js and the Supabase CDN script.
 */

// Redirects to the login page if not logged in. Call this at the top of
// every protected admin page (dashboard, galleries, tournaments, etc).
async function requireAdminLogin() {
  if (!supabaseClient) {
    showConfigWarning();
    return null;
  }
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = "login.html";
    return null;
  }
  return session;
}

// Call this on login.html itself — if already logged in, skip straight to
// the dashboard instead of showing the login form again.
async function redirectIfAlreadyLoggedIn() {
  if (!supabaseClient) {
    showConfigWarning();
    return;
  }
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) window.location.href = "dashboard.html";
}

async function adminLogin(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  return { data, error };
}

async function adminLogout() {
  await supabaseClient.auth.signOut();
  window.location.href = "login.html";
}

function showConfigWarning() {
  document.body.innerHTML =
    '<div style="max-width:560px;margin:80px auto;padding:32px;font-family:sans-serif;' +
    'background:#fff3cd;border:1px solid #d4a017;border-radius:8px;color:#3a2e00;">' +
    "<h2 style=\"margin-top:0;\">Supabase not configured yet</h2>" +
    "<p>The admin panel needs your Supabase project URL and public key before it can work. " +
    "Open <code>js/supabase-config.js</code> and fill in the two placeholder values — " +
    "instructions are in the comments at the top of that file, and in HOW-TO-EDIT.md.</p>" +
    "</div>";
}

// Wire up logout buttons automatically on any page that has one
document.addEventListener("DOMContentLoaded", function () {
  var logoutBtn = document.querySelector("#admin-logout");
  if (logoutBtn) logoutBtn.addEventListener("click", adminLogout);
});
