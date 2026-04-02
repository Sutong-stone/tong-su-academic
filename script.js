const storageKey = "tong-su-homepage-language";
const state = { lang: localStorage.getItem(storageKey) || "en" };

function qs(selector) { return document.querySelector(selector); }
function qsa(selector) { return Array.from(document.querySelectorAll(selector)); }
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderNav(content) {
  const nav = qs(".site-nav");
  nav.innerHTML = "";
  ["about", "publications", "funding", "services", "teaching", "contact"].forEach((key) => {
    const link = document.createElement("a");
    link.href = `#${key}`;
    link.textContent = content.nav[key];
    nav.append(link);
  });
}

function renderPage() {
  const content = window.siteContent[state.lang];
  const { profile, shared } = window.siteContent;
  renderNav(content);

  const photoBlock = profile.photo
    ? `<img class="hero-photo" src="${profile.photo}" alt="Portrait of Tong Su">`
    : "";

  qs("#app").innerHTML = `
    <main>
      <section id="about" class="hero">
        <div class="portrait-frame">${photoBlock}</div>
        <div class="hero-copy">
          <h1>${content.about.name}</h1>
          <p class="hero-role">${content.about.role}</p>
          <p class="hero-affiliation">${content.about.affiliation}</p>
          <p class="hero-bio">${content.about.bio}</p>
          <div><a class="button" href="${profile.cvPath}" ${profile.cvPath === "#" ? "" : "download"}>${content.about.cvLabel}</a></div>
          <div class="about-research">
            <h2>${content.about.researchTitle}</h2>
            <ul id="research-list">${content.about.research.map((item) => `<li>${item}</li>`).join("")}</ul>
            <p class="research-note">${content.about.note}</p>
          </div>
        </div>
      </section>

      <section id="publications" class="content-section">
        <div class="section-heading"><h2>${content.publications.title}</h2></div>
        <div>${shared.publications.map((item, index) => `
          <article class="publication-item">
            <div class="publication-marker">${String(index + 1).padStart(2, "0")}</div>
            <div>
              <h3>${item.title}</h3>
              <p class="publication-authors">${item.authors}</p>
              <p class="publication-meta">${item.venue} · ${item.year} · ${item.type}</p>
            </div>
          </article>
        `).join("")}</div>
      </section>

      <section id="funding" class="content-section">
        <div class="section-heading"><h2>${content.funding.title}</h2></div>
        <div>${shared.funding[state.lang].map((item) => `
          <article class="funding-item">
            <span class="status-pill ${item.status === "Ongoing" || item.status === "进行中" ? "is-ongoing" : ""}">${item.status}</span>
            <div>
              <h3 class="funding-category">${item.category}</h3>
              <p class="funding-role">${item.role}</p>
              <p>${item.title}</p>
              ${item.grant ? `<p class="funding-grant">${item.grant}</p>` : ""}
            </div>
          </article>
        `).join("")}</div>
      </section>

      <section id="services" class="content-section">
        <div class="section-heading"><h2>${content.services.title}</h2></div>
        <div class="service-layout">
          <div class="service-panel">
            <h3>${content.services.reviewerTitle}</h3>
            <ul class="plain-list reviewer-grid">${shared.reviewers.map((item) => `<li>${item}</li>`).join("")}</ul>
          </div>
          <div class="service-panel">
            <h3>${content.services.rolesTitle}</h3>
            <p class="service-note service-note-inline">${content.services.rolesNote}</p>
            <ul class="plain-list">${shared.roles[state.lang].map((item) => `<li>${item}</li>`).join("")}</ul>
          </div>
        </div>
      </section>

      <section id="teaching" class="content-section">
        <div class="section-heading"><h2>${content.teaching.title}</h2></div>
        <ul class="plain-list">${shared.teaching[state.lang].map((item) => `<li><a class="teaching-link" href="${item.href}" target="_blank" rel="noreferrer">${item.label}</a><p class="teaching-note">${item.note}</p></li>`).join("")}</ul>
      </section>

      <section id="contact" class="content-section">
        <div class="section-heading"><h2>${content.contact.title}</h2></div>
        <div class="contact-inline">${shared.contact[state.lang].map((item) => `<div class="contact-link-row"><span class="contact-label">${item.label}</span><a class="contact-value" href="${item.href}" target="_blank" rel="noreferrer">${item.value}</a></div>`).join("")}</div>
      </section>
    </main>
  `;

  document.title = state.lang === "en" ? "Tong Su | Academic Homepage" : "苏彤 | 学术主页";
  qsa("[data-lang-option]").forEach((option) => option.classList.toggle("is-active", option.dataset.langOption === state.lang));
  document.documentElement.lang = state.lang === "en" ? "en" : "zh-CN";
}

function setupLanguageToggle() {
  qs(".lang-switch").addEventListener("click", (event) => {
    const target = event.target.closest("[data-lang-option]");
    if (!target) return;
    state.lang = target.dataset.langOption;
    localStorage.setItem(storageKey, state.lang);
    renderPage();
  });
}

function setupMobileMenu() {
  const toggle = qs(".nav-toggle");
  const nav = qs(".site-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open");
  });
  nav.addEventListener("click", (event) => {
    if (event.target.tagName !== "A") return;
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderPage();
  setupLanguageToggle();
  setupMobileMenu();
});
