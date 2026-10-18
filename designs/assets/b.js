(() => {
  const M = window.Motion || null;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NS = "http://www.w3.org/2000/svg";
  const drawLines = (bx) => {
    const svg = bx.querySelector(".bx-lines");
    if (!svg) return;
    svg.replaceChildren();
    const view = svg.parentElement.getBoundingClientRect();
    bx.querySelectorAll(".bx-ann").forEach((a) => {
      if (!a.offsetParent) return;
      const pin = bx.querySelector(`[data-pin="${a.dataset.to}"] .pin`);
      if (!pin || !pin.offsetParent) return;
      const c = a.getBoundingClientRect(), p = pin.getBoundingClientRect();
      const px = p.left + p.width / 2 - view.left, py = p.top + p.height / 2 - view.top;
      const left = c.left + c.width / 2 < p.left;
      const cx = (left ? c.right : c.left) - view.left, cy = Math.min(Math.max(py, c.top + 18), c.bottom - 18) - view.top;
      const mx = left ? Math.max(cx + 16, px - 24) : Math.min(cx - 16, px + 24);
      const path = document.createElementNS(NS, "path");
      path.setAttribute("d", `M${cx} ${cy} H${mx} L${px} ${py}`);
      const dot = document.createElementNS(NS, "circle");
      dot.setAttribute("cx", px); dot.setAttribute("cy", py); dot.setAttribute("r", 4);
      svg.append(path, dot);
      if (M && !still) M.animate(path, { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.5, ease: "easeOut" });
    });
  };

  document.querySelectorAll("[data-bx]").forEach((bx) => {
    const chips = [...bx.querySelectorAll(".bx-chip")];
    const max = chips.length;
    let level = 1, timer = null, user = false;

    const set = (n, fromUser) => {
      n = ((n - 1 + max) % max) + 1;
      const prev = level;
      level = n;
      bx.dataset.level = String(n);
      chips.forEach((c) => c.setAttribute("aria-pressed", String(+c.dataset.go === n)));
      const chip = chips[n - 1];
      bx.querySelector("[data-count]").textContent = `Level ${n} of ${max}`;
      bx.querySelector(".bx-count [data-name]").textContent = chip.dataset.name;
      if (M && !still) {
        const fresh = [...bx.querySelectorAll(`[data-min="${n}"], [data-at="${n}"]`)].filter((el) => el.offsetParent);
        if (n > prev && fresh.length) M.animate(fresh, { opacity: [0, 1], y: [10, 0], scale: [0.96, 1] }, { duration: 0.45, delay: M.stagger(0.08), ease: [0.2, 0.7, 0.2, 1] });
        const list = bx.querySelector(`[data-only="${n}"]`);
        if (list && list.offsetParent) M.animate(list.querySelectorAll(".new"), { opacity: [0, 1], y: [6, 0] }, { duration: 0.35, delay: M.stagger(0.05) });
      }
      requestAnimationFrame(() => drawLines(bx));
      if (fromUser) { user = true; stop(); }
    };
    const stop = () => { clearInterval(timer); timer = null; };
    const play = () => { if (!user && !still && !timer) timer = setInterval(() => set(level + 1), 4500); };

    chips.forEach((c) => c.addEventListener("click", () => set(+c.dataset.go, true)));
    bx.querySelectorAll(".bx-step").forEach((b) => b.addEventListener("click", () => set(level + +b.dataset.step, true)));
    bx.addEventListener("keydown", (e) => {
      if (!e.target.closest(".bx-ctl")) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); set(level + (e.key === "ArrowRight" ? 1 : -1), true); chips[level - 1].focus(); }
    });
    if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => (e.isIntersecting ? play() : stop()), { threshold: 0.4 }).observe(bx);
    addEventListener("resize", () => drawLines(bx));
    if (document.fonts) document.fonts.ready.then(() => drawLines(bx));
    drawLines(bx);
  });
  if (M && !still) {
    document.querySelectorAll("[data-count-to]").forEach((el) => {
      const raw = el.dataset.countTo, m = raw.match(/^([\d,]+)(.*)$/);
      if (!m) return;
      const end = +m[1].replace(/,/g, ""), tail = m[2];
      M.inView(el, () => {
        M.animate(0, end, { duration: end > 1000 ? 1.6 : 1, ease: "easeOut", onUpdate: (v) => { el.textContent = Math.round(v).toLocaleString("en-US") + tail; }, onComplete: () => { el.textContent = raw; } });
      }, { amount: 0.6 });
    });

    const lines = document.querySelectorAll(".hero h1 .ln");
    if (lines.length) M.animate(lines, { opacity: [0, 1], y: [24, 0] }, { duration: 0.6, delay: M.stagger(0.09), ease: [0.2, 0.7, 0.2, 1] });
  }
})();
