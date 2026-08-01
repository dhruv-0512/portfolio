/**
 * DotField.js – vanilla JS port of the React Bits DotField component.
 * Pure Canvas 2D, zero external dependencies.
 *
 * Usage:
 *   import { initDotField } from './DotField.js';
 *   const destroy = initDotField(containerEl, options);
 *   // later: destroy();
 */
export function initDotField(container, opts = {}) {
  const {
    dotRadius      = 1.5,
    dotSpacing     = 14,
    cursorRadius   = 500,
    cursorForce    = 0.1,
    bulgeOnly      = true,
    bulgeStrength  = 67,
    glowRadius     = 160,
    sparkle        = false,
    waveAmplitude  = 0,
    gradientFrom   = 'rgba(168, 85, 247, 0.35)',
    gradientTo     = 'rgba(180, 151, 207, 0.25)',
    glowColor      = '#120F17',
  } = opts;

  // ── Mutable props mirror (can be updated without rebuilding) ──────────────
  const props = { dotRadius, dotSpacing, cursorRadius, cursorForce, bulgeOnly, bulgeStrength, sparkle, waveAmplitude, gradientFrom, gradientTo };

  // ── Canvas ────────────────────────────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d', { alpha: true });
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // ── SVG glow overlay ──────────────────────────────────────────────────────
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;';
  container.appendChild(svg);

  const glowId = `dfg-${Math.random().toString(36).slice(2, 9)}`;
  const defs   = document.createElementNS(NS, 'defs');
  const rGrad  = document.createElementNS(NS, 'radialGradient');
  rGrad.setAttribute('id', glowId);
  const stop0  = document.createElementNS(NS, 'stop');
  stop0.setAttribute('offset', '0%');
  stop0.setAttribute('stop-color', glowColor);
  const stop1  = document.createElementNS(NS, 'stop');
  stop1.setAttribute('offset', '100%');
  stop1.setAttribute('stop-color', 'transparent');
  rGrad.appendChild(stop0);
  rGrad.appendChild(stop1);
  defs.appendChild(rGrad);
  svg.appendChild(defs);

  const glowCircle = document.createElementNS(NS, 'circle');
  glowCircle.setAttribute('cx', '-9999');
  glowCircle.setAttribute('cy', '-9999');
  glowCircle.setAttribute('r', String(glowRadius));
  glowCircle.setAttribute('fill', `url(#${glowId})`);
  glowCircle.style.opacity = '0';
  glowCircle.style.willChange = 'opacity';
  svg.appendChild(glowCircle);

  // ── State ─────────────────────────────────────────────────────────────────
  const mouse   = { x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0 };
  const size    = { w: 0, h: 0, offsetX: 0, offsetY: 0 };
  let dots      = [];
  let glowOpacity = 0;
  let engagement  = 0;
  let frameCount  = 0;
  let raf         = null;
  let resizeTimer = null;

  // ── Grid builder ──────────────────────────────────────────────────────────
  function buildDots(w, h) {
    const step = props.dotRadius + props.dotSpacing;
    const cols = Math.ceil(w / step);
    const rows = Math.ceil(h / step);
    dots = new Array(rows * cols);
    let idx = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const ax = col * step + step / 2;
        const ay = row * step + step / 2;
        dots[idx++] = { ax, ay, sx: ax, sy: ay, vx: 0, vy: 0, x: ax, y: ay };
      }
    }
  }

  // ── Resize ────────────────────────────────────────────────────────────────
  function doResize() {
    const rect = container.getBoundingClientRect();
    const w = Math.max(window.innerWidth, rect.width);
    const h = rect.height;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width  = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    size.w = w; size.h = h;
    size.offsetX = rect.left + window.scrollX;
    size.offsetY = rect.top  + window.scrollY;
    buildDots(w, h);
  }

  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(doResize, 100);
  }

  // ── Mouse tracking ────────────────────────────────────────────────────────
  function onMouseMove(e) {
    mouse.x = e.pageX - size.offsetX;
    mouse.y = e.pageY - size.offsetY;
  }

  const speedInterval = setInterval(() => {
    const dx = mouse.prevX - mouse.x;
    const dy = mouse.prevY - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    mouse.speed += (dist - mouse.speed) * 0.5;
    if (mouse.speed < 0.001) mouse.speed = 0;
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
  }, 20);

  // ── Animation loop ────────────────────────────────────────────────────────
  const TWO_PI = Math.PI * 2;

  function tick() {
    frameCount++;
    const { w, h } = size;
    const p = props;
    const len = dots.length;
    const t = frameCount * 0.02;

    const targetEng = Math.min(mouse.speed / 5, 1);
    engagement += (targetEng - engagement) * 0.06;
    if (engagement < 0.001) engagement = 0;
    const eng = engagement;

    glowOpacity += (eng - glowOpacity) * 0.08;
    glowCircle.setAttribute('cx', String(mouse.x));
    glowCircle.setAttribute('cy', String(mouse.y));
    glowCircle.style.opacity = String(glowOpacity);

    ctx.clearRect(0, 0, w, h);

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, p.gradientFrom);
    grad.addColorStop(1, p.gradientTo);
    ctx.fillStyle = grad;

    const cr   = p.cursorRadius;
    const crSq = cr * cr;
    const rad  = p.dotRadius / 2;
    const isBulge = p.bulgeOnly;

    ctx.beginPath();

    for (let i = 0; i < len; i++) {
      const d = dots[i];
      const dx = mouse.x - d.ax;
      const dy = mouse.y - d.ay;
      const distSq = dx * dx + dy * dy;

      if (distSq < crSq && eng > 0.01) {
        const dist = Math.sqrt(distSq);
        if (isBulge) {
          const tf = 1 - dist / cr;
          const push = tf * tf * p.bulgeStrength * eng;
          const angle = Math.atan2(dy, dx);
          d.sx += (d.ax - Math.cos(angle) * push - d.sx) * 0.15;
          d.sy += (d.ay - Math.sin(angle) * push - d.sy) * 0.15;
        } else {
          const angle = Math.atan2(dy, dx);
          const move = (500 / dist) * (mouse.speed * p.cursorForce);
          d.vx += Math.cos(angle) * -move;
          d.vy += Math.sin(angle) * -move;
        }
      } else if (isBulge) {
        d.sx += (d.ax - d.sx) * 0.1;
        d.sy += (d.ay - d.sy) * 0.1;
      }

      if (!isBulge) {
        d.vx *= 0.9;
        d.vy *= 0.9;
        d.x = d.ax + d.vx;
        d.y = d.ay + d.vy;
        d.sx += (d.x - d.sx) * 0.1;
        d.sy += (d.y - d.sy) * 0.1;
      }

      let drawX = d.sx;
      let drawY = d.sy;
      if (p.waveAmplitude > 0) {
        drawY += Math.sin(d.ax * 0.03 + t) * p.waveAmplitude;
        drawX += Math.cos(d.ay * 0.03 + t * 0.7) * p.waveAmplitude * 0.5;
      }

      if (p.sparkle) {
        const hash = ((i * 2654435761) ^ (frameCount >> 3)) >>> 0;
        if ((hash % 100) < 3) {
          ctx.moveTo(drawX + rad * 1.8, drawY);
          ctx.arc(drawX, drawY, rad * 1.8, 0, TWO_PI);
        } else {
          ctx.moveTo(drawX + rad, drawY);
          ctx.arc(drawX, drawY, rad, 0, TWO_PI);
        }
      } else {
        ctx.moveTo(drawX + rad, drawY);
        ctx.arc(drawX, drawY, rad, 0, TWO_PI);
      }
    }

    ctx.fill();
    raf = requestAnimationFrame(tick);
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  doResize();
  window.addEventListener('resize', onResize);
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  raf = requestAnimationFrame(tick);

  // ── Cleanup ───────────────────────────────────────────────────────────────
  return () => {
    cancelAnimationFrame(raf);
    clearInterval(speedInterval);
    clearTimeout(resizeTimer);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('mousemove', onMouseMove);
    if (canvas.parentElement === container) container.removeChild(canvas);
    if (svg.parentElement === container) container.removeChild(svg);
  };
}
