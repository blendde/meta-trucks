(() => {
  const CONTACT_PHONE = "+389 70 369 897";
  const CONTACT_EMAIL = "metatraks@gmail.com";

  let currentLang = "sq";
  let currentBrand = "all";

  const brands = ["all", ...new Set(PRODUCTS.map(p => p.brand))];

  function t(key) {
    return I18N[currentLang][key] || key;
  }

  function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-href]").forEach(el => {
      const key = el.getAttribute("data-i18n-href");
      el.href = t(key);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
    });
    // update filter pill "All" label
    document.querySelectorAll(".filter-pill[data-brand='all']").forEach(el => {
      el.textContent = t("filter_all");
    });
    // re-render cards to update translated names and CTA
    renderCards();
  }

  function buildFilterBar() {
    const bar = document.getElementById("filter-bar");
    bar.innerHTML = "";
    brands.forEach(brand => {
      const btn = document.createElement("button");
      btn.className = "filter-pill" + (brand === currentBrand ? " active" : "");
      btn.setAttribute("data-brand", brand);
      btn.textContent = brand === "all" ? t("filter_all") : brand;
      btn.addEventListener("click", () => {
        currentBrand = brand;
        document.querySelectorAll(".filter-pill").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderCards();
      });
      bar.appendChild(btn);
    });
  }

  function buildCard(product) {
    const name = typeof product.name === "object" ? product.name[currentLang] || product.name.en : product.name;
    const subject = encodeURIComponent(t("inquiry_subject") + " — " + product.id);
    const body = encodeURIComponent(
      t("inquiry_body")
        .replace("{{id}}", product.id)
        .replace("{{name}}", name)
    );
    const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    const card = document.createElement("div");
    card.className = "product-card";
    card.setAttribute("data-brand", product.brand);

    card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${product.image}" alt="${name}" loading="lazy">
      </div>
      <div class="card-body">
        <div class="card-brand">${product.brand}</div>
        <div class="card-name">${name}</div>
        <div class="card-id">${t("card_id")}: ${product.id}</div>
        <div class="price-badge">
          <div class="price-badge-label">⚡ ${t("badge_label")}</div>
          <div class="price-badge-amount"><span class="price-badge-currency">€</span>${product.price}</div>
        </div>
        <a class="card-cta" href="${mailtoHref}">${t("card_cta")}</a>
      </div>
    `;
    return card;
  }

  function renderCards() {
    const grid = document.getElementById("product-grid");
    const noResults = document.getElementById("no-results");
    grid.innerHTML = "";

    const filtered = currentBrand === "all"
      ? PRODUCTS
      : PRODUCTS.filter(p => p.brand === currentBrand);

    if (filtered.length === 0) {
      noResults.classList.add("visible");
    } else {
      noResults.classList.remove("visible");
      filtered.forEach(p => grid.appendChild(buildCard(p)));
    }
    grid.appendChild(noResults);
  }

  function initLangSwitcher() {
    document.querySelectorAll(".lang-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        if (lang === currentLang) return;
        currentLang = lang;
        document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        applyTranslations();
      });
    });
  }

  function initContactLinks() {
    document.querySelectorAll(".contact-phone").forEach(el => {
      el.href = `tel:${CONTACT_PHONE.replace(/\s/g, "")}`;
      el.querySelector(".contact-info-value").textContent = CONTACT_PHONE;
    });
    document.querySelectorAll(".contact-email").forEach(el => {
      el.href = `mailto:${CONTACT_EMAIL}`;
      el.querySelector(".contact-info-value").textContent = CONTACT_EMAIL;
    });
    document.querySelectorAll(".hero-phone-btn").forEach(el => {
      el.href = `tel:${CONTACT_PHONE.replace(/\s/g, "")}`;
    });
    document.querySelectorAll(".hero-email-btn").forEach(el => {
      el.href = `mailto:${CONTACT_EMAIL}`;
    });
  }

  function init() {
    initContactLinks();
    initLangSwitcher();
    buildFilterBar();
    renderCards();
    applyTranslations();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
