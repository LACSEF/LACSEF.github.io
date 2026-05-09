const _base = document.currentScript
  ? document.currentScript.src.replace(/\/js\/components\.js.*$/, "")
  : "";

document.addEventListener("DOMContentLoaded", async () => {
  async function inject(id, url) {
    const res = await fetch(_base + "/" + url);
    const html = await res.text();
    const el = document.getElementById(id);
    if (el) el.outerHTML = html;
  }

  await Promise.all([
    inject("site-header", "components/header.html"),
    inject("site-footer", "components/footer.html"),
  ]);

  let currentPage = location.pathname.split("/").pop() || "home.html";
  if (currentPage === "article.html") currentPage = "news.html";
  document.querySelectorAll("header nav a[data-page]").forEach((a) => {
    if (a.dataset.page === currentPage) {
      a.classList.add("font-bold", "border-b-2", "border-on-primary", "pb-1");
    }
  });

  const toggle = document.getElementById("mobile-nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  if (toggle && mobileNav) {
    const icon = toggle.querySelector(".material-symbols-outlined");
    toggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("hidden") === false;
      toggle.setAttribute("aria-expanded", String(isOpen));
      if (icon) icon.textContent = isOpen ? "close" : "menu";
    });
    mobileNav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        mobileNav.classList.add("hidden");
        toggle.setAttribute("aria-expanded", "false");
        if (icon) icon.textContent = "menu";
      });
    });
  }
});
