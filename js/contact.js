/**
 * contact.js — submits the enquiry form via FormSubmit's AJAX endpoint so the
 * visitor sees a friendly on-page "Thank You" message instead of being sent
 * to FormSubmit's own generic branded confirmation page.
 *
 * Progressive enhancement: if this script fails to load or JS is disabled,
 * the <form> still has a real action="https://formsubmit.co/..." and
 * method="POST", so it still works — it just falls back to FormSubmit's own
 * plain "Thanks!" page in that rare case.
 *
 * ONE-TIME SETUP REMINDER: the first real enquiry ever sent (AJAX or not)
 * triggers a confirmation email to sentouken.admin@gmail.com. Someone needs
 * to click "Confirm" in that email once before delivery starts working.
 */
document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("#enquiry-form");
  if (!form) return;

  var status = document.querySelector("#form-status");
  var successBlock = document.querySelector("#enquiry-success");
  var submitBtn = form.querySelector('button[type="submit"]');
  var endpoint = "https://formsubmit.co/ajax/" + "sentouken.admin@gmail.com";

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (status) { status.textContent = "Sending…"; status.dataset.state = ""; }
    if (submitBtn) submitBtn.disabled = true;

    fetch(endpoint, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: new FormData(form)
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Network response was not OK");
        return res.json();
      })
      .then(function () {
        form.hidden = true;
        if (status) { status.textContent = ""; status.dataset.state = ""; }
        if (successBlock) {
          successBlock.hidden = false;
          successBlock.focus && successBlock.focus();
        }
      })
      .catch(function () {
        if (status) {
          status.dataset.state = "error";
          status.textContent = "Something went wrong sending this — please call or WhatsApp us directly at 98405 40985, or try again.";
        }
      })
      .finally(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
  });
});
