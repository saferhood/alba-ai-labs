// ALBA AI LABS site scripts
(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var toggle = document.getElementById("nav-toggle");
  var links = document.getElementById("nav-links");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mobile menu
  if (nav && toggle && links) {
    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // Nav background once scrolled
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Reveal on scroll (skipped when reduced motion is requested)
  var targets = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
    targets.forEach(function (el) { io.observe(el); });
  }
})();

// Showcase viewer: modality tabs and overlay toggles
(function () {
  "use strict";
  var viewer = document.getElementById("viewer");
  if (!viewer) return;
  var tabs = viewer.querySelectorAll(".viewer__tab");
  var scans = viewer.querySelectorAll(".scan");
  var findings = viewer.querySelectorAll(".finding");
  var confE = document.getElementById("conf-evolved"), confB = document.getElementById("conf-base");
  var barE = document.getElementById("bar-evolved"), barB = document.getElementById("bar-base");

  var show = function (key) {
    tabs.forEach(function (t) {
      var on = t.getAttribute("data-scan") === key;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    scans.forEach(function (s) { s.classList.toggle("is-active", s.getAttribute("data-scan") === key); });
    findings.forEach(function (f) {
      var on = f.getAttribute("data-scan") === key;
      f.classList.toggle("is-active", on);
      if (on) {
        var e = f.getAttribute("data-confidence"), b = f.getAttribute("data-base");
        confE.textContent = e + "%"; confB.textContent = b + "%";
        barE.style.width = e + "%"; barB.style.width = b + "%";
      }
    });
  };
  tabs.forEach(function (t) { t.addEventListener("click", function () { show(t.getAttribute("data-scan")); }); });

  var bind = function (id, cls) {
    var btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener("click", function () {
      var off = viewer.classList.toggle(cls);
      btn.classList.toggle("is-on", !off);
      btn.setAttribute("aria-pressed", off ? "false" : "true");
    });
  };
  bind("heat-toggle", "heat-off");
  bind("box-toggle", "box-off");
})();

// Home hero: the funnel. 48 models in, one out, bred live.
(function () {
  "use strict";
  var canvas = document.getElementById("funnel");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 640, H = 640, scale = 1, fontScale = 1;   // logical coordinates, scaled to the element

  var SIZES = [48, 24, 12, 6, 3, 1];
  var ROW_Y = [56, 128, 212, 306, 410, 530];
  var ROW_R = [3.5, 5, 9, 14, 19, 30];
  var LEFT = 150, FULL = 470;
  var DIM = [42, 74, 133], SKY = [143, 194, 244];
  var FONT = "Manrope, system-ui, sans-serif";

  var rows = [], phases = [], cycle = 0, elapsed = 0, speed = 1, last = 0;

  var rand = function (a, b) { return a + Math.random() * (b - a); };
  var ease = function (p) { return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var tone = function (t) {   // 0 dim navy, 1 sky blue
    var c = [0, 1, 2].map(function (i) { return Math.round(DIM[i] + (SKY[i] - DIM[i]) * t); });
    return "rgb(" + c.join(",") + ")";
  };
  var warmth = function (score) { return clamp((score - 30) / 66, 0, 1); };

  // One full lineage, computed up front: positions, scores, parents.
  var seed = function () {
    rows = [];
    for (var g = 0; g < SIZES.length; g++) {
      var n = SIZES[g], span = n >= 6 ? FULL : (n === 3 ? 300 : 0), x0 = LEFT + (FULL - span) / 2;
      var dots = [];
      for (var k = 0; k < n; k++) {
        dots.push({ x: x0 + (n > 1 ? span * k / (n - 1) : 0), y: ROW_Y[g], r: ROW_R[g], score: 0, alive: true, parents: null });
      }
      rows.push({ n: n, dots: dots });
    }
    rows[0].dots.forEach(function (d) { d.score = Math.round(rand(28, 58)); });
    for (var g = 1; g < rows.length; g++) {
      var prev = rows[g - 1].dots.slice().sort(function (a, b) { return b.score - a.score; });
      var keep = prev.slice(0, Math.max(2, rows[g].n));
      rows[g - 1].dots.forEach(function (d) { d.alive = keep.indexOf(d) >= 0; });
      rows[g].dots.forEach(function (d, i) {
        var a = keep[i % keep.length], b = keep[(i + 1 + Math.floor(rand(0, keep.length - 1))) % keep.length];
        if (b === a) b = keep[(i + 1) % keep.length];
        d.parents = [a, b];
        var gain = g === rows.length - 1 ? rand(4, 7) : rand(5, 9);
        d.score = Math.min(96, Math.round(Math.max(a.score, b.score) + gain));
      });
    }
    rows[rows.length - 1].dots[0].alive = true;
    // Timeline: each row appears (bred from the row above), is scored, then culled.
    phases = []; var t = 0;
    var add = function (kind, g, dur) { phases.push({ kind: kind, g: g, start: t, dur: dur }); t += dur; };
    for (var g = 0; g < rows.length; g++) {
      add("appear", g, g === 0 ? 1.0 : 0.9);
      add("score", g, g === 0 ? 0.9 : 0.7);
      if (g < rows.length - 1) add("cull", g, 0.6);
    }
    add("hold", rows.length - 1, 3.2);
    add("fade", rows.length - 1, 0.8);
    cycle = t;
  };

  var resize = function () {
    var rect = canvas.getBoundingClientRect();
    var w = rect.width || 640, h = rect.height || w;
    canvas.width = w * dpr; canvas.height = h * dpr;
    scale = w / W;
    fontScale = clamp(1 / scale, 1, 1.3);
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
  };

  // Progress of a phase for row g: 0 before it starts, 0..1 during, 1 after. -1 if no such phase.
  var prog = function (kind, g) {
    for (var i = 0; i < phases.length; i++) {
      var p = phases[i];
      if (p.kind === kind && p.g === g) return clamp((elapsed - p.start) / p.dur, 0, 1);
    }
    return -1;
  };

  var circle = function (x, y, r, fill, alpha) {
    ctx.globalAlpha = alpha; ctx.fillStyle = fill;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  };
  var text = function (str, x, y, size, color, alpha, weight, align) {
    ctx.globalAlpha = alpha; ctx.fillStyle = color;
    ctx.font = (weight || 600) + " " + (size * fontScale).toFixed(1) + "px " + FONT;
    ctx.textAlign = align || "center"; ctx.textBaseline = "middle";
    ctx.fillText(str, x, y);
  };

  var draw = function () {
    ctx.clearRect(0, 0, W, H);
    var fadeOut = prog("fade", rows.length - 1);
    var master = fadeOut > 0 ? 1 - ease(fadeOut) : 1;

    for (var g = 0; g < rows.length; g++) {
      var row = rows[g], n = row.n, r = ROW_R[g];
      var ap = prog("appear", g); if (ap <= 0) break;
      var sp = prog("score", g), cp = prog("cull", g);
      var rowT = g / (rows.length - 1);
      var showScore = n <= 24 && !(n === 24 && scale < 0.75);

      // parent links, drawn as the row is bred
      if (row.dots[0].parents) {
        row.dots.forEach(function (d, i) {
          var local = clamp((ap - i / n * 0.3) / 0.7, 0, 1);
          if (local <= 0) return;
          d.parents.forEach(function (p) {
            var x0 = p.x, y0 = p.y + p.r + 2, x1 = d.x, y1 = d.y - r - 2, my = (y0 + y1) / 2;
            ctx.globalAlpha = (0.12 + 0.22 * rowT) * master;
            ctx.strokeStyle = tone(0.5); ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(x0, y0);
            // grow the curve from the parent toward the child
            var steps = 16, upto = Math.floor(steps * ease(local));
            for (var s = 1; s <= upto; s++) {
              var u = s / steps, mt = 1 - u;
              var bx = mt * mt * mt * x0 + 3 * mt * mt * u * x0 + 3 * mt * u * u * x1 + u * u * u * x1;
              var by = mt * mt * mt * y0 + 3 * mt * mt * u * my + 3 * mt * u * u * my + u * u * u * y1;
              ctx.lineTo(bx, by);
            }
            ctx.stroke();
          });
        });
      }

      // row label
      var la = ease(clamp(ap * 1.5, 0, 1)) * master;
      text("Gen " + (g + 1), 20, ROW_Y[g] - 3 * fontScale, 12, rowT < 0.5 ? "#7f98c4" : "#C9DAF5", la, 700, "left");
      text(n + (n === 1 ? " model" : " models"), 20, ROW_Y[g] + 15 * fontScale, 10.5, "#5f78a6", la, 500, "left");

      // dots
      row.dots.forEach(function (d, i) {
        var local = clamp((ap - i / n * 0.3) / 0.7, 0, 1);
        if (local <= 0) return;
        var grow = ease(local);
        var warm = warmth(d.score) * (0.25 + 0.75 * rowT);
        var t = warm * (sp > 0 ? ease(sp) : 0.35);                       // scoring lights the dot up
        var alpha = (0.45 + 0.55 * t) * master, rr = r * grow;
        if (!d.alive && cp > 0) {                                        // culled: shrink to a faint ring
          var k = ease(cp);
          alpha *= 1 - 0.55 * k; rr = r * (1 - 0.3 * k);
          ctx.globalAlpha = alpha; ctx.strokeStyle = tone(0.4); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(d.x, d.y, rr, 0, Math.PI * 2); ctx.stroke();
          if (k < 1) circle(d.x, d.y, rr, tone(t), alpha * (1 - k));
        } else {
          if (n <= 3 && sp > 0) {                                        // glow on the strong rows
            var grd = ctx.createRadialGradient(d.x, d.y, rr * 0.6, d.x, d.y, rr * 2.4);
            grd.addColorStop(0, "rgba(143,194,244,0.45)"); grd.addColorStop(1, "rgba(143,194,244,0)");
            circle(d.x, d.y, rr * 2.4, grd, ease(sp) * master);
          }
          circle(d.x, d.y, rr, tone(t), alpha);
        }
        // score
        if (showScore && sp > 0 && !(cp >= 1 && !d.alive)) {
          var shown = Math.round(d.score * ease(clamp(sp * 1.3, 0, 1)));
          var sa = ease(clamp(sp * 2, 0, 1)) * master * (!d.alive && cp > 0 ? 1 - 0.7 * ease(cp) : 1);
          if (r >= 11) text(String(shown), d.x, d.y + 0.5, Math.max(10, r * 0.9), "#07101f", sa, 700);
          else text(String(shown), d.x, d.y - r - 7, 9, "#8FC2F4", sa * 0.9, 600);
        }
      });
    }

    // the winner: pulse ring and caption while holding
    var hp = prog("hold", rows.length - 1);
    if (hp > 0 && hp < 1) {
      var win = rows[rows.length - 1].dots[0], pulse = (elapsed * 0.6) % 1;
      ctx.globalAlpha = (1 - pulse) * 0.5 * master; ctx.strokeStyle = "#8FC2F4"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(win.x, win.y, win.r + 6 + pulse * 26, 0, Math.PI * 2); ctx.stroke();
      text("Evolved for your case.", win.x, win.y + win.r + 26, 12, "#C9DAF5", ease(clamp(hp * 3, 0, 1)) * master, 600);
    }
    ctx.globalAlpha = 1;
  };

  var frame = function (now) {
    var dt = Math.min(50, now - last) / 1000; last = now;
    elapsed += dt * speed;
    if (elapsed >= cycle) { seed(); elapsed = 0; }
    draw();
    requestAnimationFrame(frame);
  };

  seed();
  resize();
  window.addEventListener("resize", resize);
  if (reduce) { elapsed = phases[phases.length - 2].start + 0.01; draw(); return; }   // still frame of the finished funnel
  var hero = canvas.closest(".hero2");
  if (hero && window.matchMedia("(hover: hover)").matches) {
    hero.addEventListener("mousemove", function (e) {
      var rect = hero.getBoundingClientRect();
      speed = 0.7 + ((e.clientX - rect.left) / rect.width) * 1.0;
    });
    hero.addEventListener("mouseleave", function () { speed = 1; });
  }
  requestAnimationFrame(function (now) { last = now; frame(now); });
})();
