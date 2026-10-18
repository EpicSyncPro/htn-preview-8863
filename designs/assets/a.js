(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const M = window.Motion;

  document.querySelectorAll(".stage").forEach((stage) => {
    const phone = stage.querySelector("[data-demo]");
    if (!phone) return;
    const views = [...phone.querySelectorAll("[data-view]")];
    const chips = [...stage.querySelectorAll(".stepper [data-demo-go]")];
    const live = phone.querySelector("[data-demo-live]");
    const tv = stage.querySelector(".tv");
    const last = views.length - 1;
    let at = 0;

    const go = (n, announce = true) => {
      n = (n + views.length) % views.length;
      if (n === at) return;
      const from = views[at], to = views[n], dir = n > at ? 1 : -1;
      at = n;
      from.hidden = true; from.classList.remove("is-on");
      to.hidden = false; to.classList.add("is-on");
      if (M && !reduce) M.animate(to, { opacity: [0, 1], x: [24 * dir, 0] }, { duration: 0.35, ease: [0.2, 0.7, 0.2, 1] });
      chips.forEach((c, i) => { c.setAttribute("aria-pressed", String(i === n)); c.classList.toggle("is-active", i === n); });
      if (tv) tv.classList.toggle("is-lit", n === last);
      if (live && announce) live.textContent = to.getAttribute("aria-label") || "";
    };

    stage.addEventListener("click", (e) => {
      const b = e.target.closest("[data-demo-go],[data-demo-next],[data-demo-prev]");
      if (!b || !stage.contains(b)) return;
      if (b.hasAttribute("data-demo-go")) go(+b.getAttribute("data-demo-go"));
      else go(at + (b.hasAttribute("data-demo-next") ? 1 : -1));
    });
    phone.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") go(at + 1);
      else if (e.key === "ArrowLeft") go(at - 1);
    });
    phone.querySelectorAll("[tabindex='-1']").forEach((b) => b.removeAttribute("tabindex"));
  });

  if (!M || reduce) return;
  const { animate, inView, stagger } = M;
  document.documentElement.classList.add("js-anim");
  const ease = [0.2, 0.7, 0.2, 1];
  const ins = document.querySelectorAll("[data-in]");
  if (ins.length) animate(ins, { opacity: [0, 1], y: [18, 0] }, { duration: 0.6, delay: stagger(0.08), ease });
  const stage = document.querySelector(".stage");
  if (stage) {
    animate(stage.querySelector(".phone"), { opacity: [0, 1], y: [40, 0] }, { duration: 0.8, delay: 0.15, ease });
    const tv = stage.querySelector(".tv"), anns = stage.querySelectorAll(".ann");
    if (tv) animate(tv, { opacity: [0, 1], x: [40, 0] }, { duration: 0.8, delay: 0.35, ease });
    if (anns.length) animate(anns, { opacity: [0, 1], scale: [0.9, 1] }, { duration: 0.45, delay: stagger(0.15, { startDelay: 0.7 }), ease });
  }
  const groups = new Map();
  document.querySelectorAll("[data-rise]").forEach((el) => {
    const k = el.parentElement;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(el);
  });
  groups.forEach((els, parent) => {
    if (parent.getBoundingClientRect().top < innerHeight) return;
    inView(parent, () => { animate(els, { opacity: [0, 1], y: [28, 0] }, { duration: 0.6, delay: stagger(0.07), ease }); }, { margin: "0px 0px 240px 0px" });
  });
})();
