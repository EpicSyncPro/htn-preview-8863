(() => {
  const M = window.Motion;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const live = M && !still;

  const hub = document.querySelector("[data-hub]");
  if (hub) {
    const panes = [...hub.querySelectorAll("[data-pane]")];
    const steps = [...hub.querySelectorAll("[data-hub-go]")];
    const count = hub.querySelector("[data-hub-count]");
    const phone = hub.querySelector(".phone");
    let cur = 0;
    const go = (n) => {
      n = (n + panes.length) % panes.length;
      if (n === cur) return;
      panes[cur].classList.remove("on");
      panes[cur].hidden = true;
      panes[n].hidden = false;
      panes[n].classList.add("on");
      steps.forEach((b, i) => { b.classList.toggle("is-active", i === n); b.setAttribute("aria-pressed", String(i === n)); });
      if (count) count.textContent = `Click ${n + 1} of ${panes.length}`;
      if (phone) phone.classList.toggle("is-focus", n === panes.length - 1);
      if (live) {
        M.animate(panes[n], { opacity: [0, 1], y: [12, 0] }, { duration: 0.35, ease: [0.2, 0.7, 0.2, 1] });
        M.animate(panes[n].querySelectorAll("li, dl > div"), { opacity: [0, 1], y: [8, 0] }, { delay: M.stagger(0.03), duration: 0.3 });
      }
      cur = n;
    };
    steps.forEach((b, i) => b.addEventListener("click", () => go(i)));
    hub.querySelector("[data-hub-prev]")?.addEventListener("click", () => go(cur - 1));
    hub.querySelector("[data-hub-next]")?.addEventListener("click", () => go(cur + 1));
    hub.addEventListener("keydown", (e) => {
      if (!e.target.closest(".stepper")) return;
      if (e.key === "ArrowRight") { go(cur + 1); steps[cur].focus(); }
      if (e.key === "ArrowLeft") { go(cur - 1); steps[cur].focus(); }
    });
  }
  const countUp = (el) => {
    const src = el.dataset.count, m = src.match(/^(\D*)([\d,]+)(.*)$/);
    if (!m) return;
    const to = Number(m[2].replace(/,/g, "")), comma = m[2].includes(",");
    M.animate(0, to, { duration: 1.2, ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => { const r = Math.round(v); el.textContent = m[1] + (comma ? r.toLocaleString("en-US") : r) + m[3]; },
      onComplete: () => { el.textContent = src; } });
  };

  if (!live) return;
  document.documentElement.classList.add("js");
  M.inView("[data-rise]", (el) => {
    M.animate(el, { opacity: [0, 1], y: [24, 0] }, { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] });
    el.querySelectorAll("[data-count]").forEach(countUp);
  }, { amount: 0.2 });
  if (hub) M.animate(hub.querySelectorAll(".win, .phone, .ann"), { opacity: [0, 1], y: [24, 0] }, { delay: M.stagger(0.12, { startDelay: 0.1 }), duration: 0.7, ease: [0.2, 0.7, 0.2, 1] });
})();
