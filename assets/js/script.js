'use strict';

const elementToggleFunc = (elem) => elem.classList.toggle('active');

const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');
if (sidebar && sidebarBtn) {
  sidebarBtn.addEventListener('click', () => elementToggleFunc(sidebar));
}

const select = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-select-value]');
const filterBtn = document.querySelectorAll('[data-filter-btn]');
const filterItems = document.querySelectorAll('[data-filter-item]');

const filterFunc = function(selectedValue) {
  const sel = selectedValue.trim().toLowerCase();

  for (let i = 0; i < filterItems.length; i++) {
    const raw = (filterItems[i].dataset.category || "").toLowerCase();

    const list = raw.includes(",")
      ? raw.split(",").map(s => s.trim()).filter(Boolean)
      : [raw.trim()];

    const show = sel === "all" || list.includes(sel);

    filterItems[i].classList.toggle("active", show);
  }
};

if (select) {
  select.addEventListener('click', function () { elementToggleFunc(this); });
}

for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener('click', function () {
    const selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    if (select) elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

let lastClickedBtn = filterBtn[0];
for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener('click', function () {
    const selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    filterFunc(selectedValue);
    if (lastClickedBtn) lastClickedBtn.classList.remove('active');
    this.classList.add('active');
    lastClickedBtn = this;
  });
}

const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');

if (form && formBtn) {
  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener('input', function () {
      formBtn.toggleAttribute('disabled', !form.checkValidity());
    });
  }
}

if (form && formBtn) {
  const statusEl = document.querySelector(".form-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) return;

    const label = formBtn.querySelector("span");
    const prevLabel = label ? label.textContent : "";
    formBtn.setAttribute("disabled", "");
    if (label) label.textContent = "Sending...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      });

      if (response.ok) {
        if (statusEl) statusEl.textContent = "Thanks! I’ll get back to you soon.";
        form.reset();
      } else {
        let msg = "Oops, something went wrong. Please try again.";
        try {
          const data = await response.json();
          if (data && data.errors) {
            msg = data.errors.map(e => e.message).join(", ");
          }
        } catch {}
        if (statusEl) statusEl.textContent = msg;
        formBtn.removeAttribute("disabled");
      }
    } catch (err) {
      if (statusEl) statusEl.textContent = "Network error. Please check your connection and try again.";
      formBtn.removeAttribute("disabled");
    } finally {
      if (label) label.textContent = prevLabel || "Send Message";
    }
  });
}

const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener('click', function () {
    for (let j = 0; j < pages.length; j++) {
      const active = this.innerHTML.toLowerCase() === pages[j].dataset.page;
      pages[j].classList.toggle('active', active);
      navigationLinks[j].classList.toggle('active', active);
      if (active) window.scrollTo(0, 0);
    }
  });
}

document.documentElement.classList.add('splash-lock');
document.body.classList.add('splash-lock');

window.addEventListener('load', () => {
  const splash = document.getElementById('splash');
  const fileEl = document.querySelector('.splash-file');
  if (!splash || !fileEl) return;

  fileEl.addEventListener('animationstart', (e) => {
    if (e.animationName === 'fileGrow') {
      setTimeout(() => {
        splash.classList.add('reveal');
        setTimeout(() => {
          splash.remove();
          document.documentElement.classList.remove('splash-lock');
          document.body.classList.remove('splash-lock');
        }, 400);
      }, 250);
    }
  });
});
