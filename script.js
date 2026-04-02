const storageKey = "tong-su-homepage-language";
const state = {
  lang: localStorage.getItem(storageKey) || "en"
};

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => Array.from(document.querySelectorAll(selector));

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function renderNav(content) {
  qsa("[data-nav]").forEach((link) => {
    link.textContent = content.nav[link.dataset.nav];
  });
}

function renderAbout(content, profile) {
  qs("#brand-name").textContent = state.lang === "en" ? profile.nameEn : profile.nameZh;
  qs("#hero-name").textContent = content.about.name;
  qs("#hero-role").textContent = content.about.role;
  qs("#hero-affiliation").textContent = content.about.affiliation;
  qs("#hero-bio").textContent = content.about.bio;
  qs("#research-title").textContent = content.about.researchTitle;
  qs("#research-note").textContent = content.about.note;

  const cvLink = qs("#cv-link");
  cvLink.textContent = content.about.cvLabel;
  cvLink.href = profile.cvPath;

  const heroPhoto = qs("#hero-photo");
  if (profile.photo) {
    heroPhoto.src = profile.photo;
    heroPhoto.hidden = false;
  } else {
    heroPhoto.removeAttribute("src");
    heroPhoto.hidden = true;
  }

  const researchList = qs("#research-list");
  researchList.innerHTML = "";
  content.about.research.forEach((item) => {
    researchList.append(createElement("li", "", item));
  });
}

function renderPublications(content, shared) {
  qs("#publications-title").textContent = content.publications.title;

  const root = qs("#publication-list");
  root.innerHTML = "";

  shared.publications.forEach((item, index) => {
    const article = createElement("article", "publication-item");
    const marker = createElement("div", "publication-marker", String(index + 1).padStart(2, "0"));
    const body = createElement("div", "publication-body");
    body.append(createElement("h3", "", item.title));
    body.append(createElement("p", "publication-authors", item.authors));
    body.append(createElement("p", "publication-meta", `${item.venue} · ${item.year} · ${item.type}`));
    article.append(marker, body);
    root.append(article);
  });
}

function renderFunding(content, shared) {
  qs("#funding-title").textContent = content.funding.title;

  const root = qs("#funding-list");
  root.innerHTML = "";

  shared.funding[state.lang].forEach((item) => {
    const article = createElement("article", "funding-item");
    const status = createElement("span", `status-pill ${item.status === "Ongoing" || item.status === "进行中" ? "is-ongoing" : ""}`, item.status);
    const body = createElement("div", "funding-body");
    body.append(createElement("h3", "funding-category", item.category));
    body.append(createElement("p", "funding-role", item.role));
    body.append(createElement("p", "funding-title", item.title));
    if (item.grant) {
      body.append(createElement("p", "funding-grant", item.grant));
    }
    article.append(status, body);
    root.append(article);
  });
}

function renderServices(content, shared) {
  qs("#services-title").textContent = content.services.title;
  qs("#reviewer-title").textContent = content.services.reviewerTitle;
  qs("#roles-title").textContent = content.services.rolesTitle;
  qs("#roles-note").textContent = content.services.rolesNote;

  const reviewerList = qs("#reviewer-list");
  reviewerList.innerHTML = "";
  shared.reviewers.forEach((item) => {
    reviewerList.append(createElement("li", "", item));
  });

  const rolesList = qs("#roles-list");
  rolesList.innerHTML = "";
  shared.roles[state.lang].forEach((item) => {
    rolesList.append(createElement("li", "", item));
  });
}

function renderTeaching(content, shared) {
  qs("#teaching-title").textContent = content.teaching.title;
  const root = qs("#teaching-list");
  root.innerHTML = "";
  shared.teaching[state.lang].forEach((item) => {
    const li = createElement("li");
    const link = document.createElement("a");
    link.href = item.href;
    link.textContent = item.label;
    link.className = "teaching-link";
    if (/^http/i.test(item.href)) {
      link.target = "_blank";
      link.rel = "noreferrer";
    }
    li.append(link);
    if (item.note) {
      li.append(createElement("p", "teaching-note", item.note));
    }
    root.append(li);
  });
}

function renderContact(content, shared) {
  qs("#contact-title").textContent = content.contact.title;
  const root = qs("#contact-list");
  root.innerHTML = "";

  shared.contact[state.lang].forEach((item) => {
    const wrapper = createElement("div", "contact-link-row");
    wrapper.append(createElement("span", "contact-label", item.label));

    let valueNode;
    if (item.href) {
      valueNode = document.createElement("a");
      valueNode.href = item.href;
      valueNode.textContent = item.value;
      if (/^http|^mailto/i.test(item.href)) {
        valueNode.target = "_blank";
        valueNode.rel = "noreferrer";
      }
    } else {
      valueNode = createElement("span", "contact-value", item.value);
    }

    valueNode.classList.add("contact-value");
    wrapper.append(valueNode);
    root.append(wrapper);
  });
}

function updateLanguageButtons() {
  qsa("[data-lang-btn]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.langBtn === state.lang);
  });
  document.documentElement.lang = state.lang === "en" ? "en" : "zh-CN";
}

function renderPage() {
  const content = window.siteContent[state.lang];
  const { profile, shared } = window.siteContent;

  renderNav(content);
  renderAbout(content, profile);
  renderPublications(content, shared);
  renderFunding(content, shared);
  renderServices(content, shared);
  renderTeaching(content, shared);
  renderContact(content, shared);
  document.title = state.lang === "en" ? "Tong Su | Academic Homepage" : "苏彤 | 学术主页";
  updateLanguageButtons();
}

function setupLanguageToggle() {
  qsa("[data-lang-btn]").forEach((button) => {
    button.addEventListener("click", () => {
      state.lang = button.dataset.langBtn;
      localStorage.setItem(storageKey, state.lang);
      renderPage();
    });
  });
}

function setupMobileMenu() {
  const toggle = qs(".menu-toggle");
  const nav = qs(".site-nav");
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open");
  });
  qsa(".site-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderPage();
  setupLanguageToggle();
  setupMobileMenu();
});
