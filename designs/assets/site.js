document.querySelectorAll("[data-menu]").forEach((b) => {
  const nav = document.getElementById(b.getAttribute("aria-controls"));
  b.addEventListener("click", () => { const o = b.getAttribute("aria-expanded") === "true"; b.setAttribute("aria-expanded", String(!o)); nav.classList.toggle("open", !o); });
});
