'use client'

import { useEffect, useRef, useState } from "react";

/**
 * text that decodes itself on a loop: letters sweep from random glyphs to
 * their true form left→right, holds, then re-decodes. spaces + punctuation
 * stay fixed — only alphanumerics scramble.
 *
 * hover → triggers a fast scramble→resolve (~420ms) that matches the name's
 * hover feel. "u hover over it basically changes alphabets and loads."
 */
const CHARS = "01/\\|_-+=*<>{}[]abcdefxyz";

function build(text: string, progress: number): string {
  const len = Math.max(text.length, 1);
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (!/[a-zA-Z0-9]/.test(ch)) {
      out += ch;
      continue;
    }
    const threshold = i / len;
    if (progress >= threshold) {
      out += ch;
    } else {
      out += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
  }
  return out;
}

export default function DecodeText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);
  const start = useRef<number | null>(null);
  const hoverEnd = useRef(0);

  const HOVER_MS = 420;
  const DECODE_MS = 1800 + Math.max(text.length, 1) * 12;
  const HOLD_MS = 4500;
  const CYCLE = DECODE_MS + HOLD_MS;

  useEffect(() => {
    function frame(t: number) {
      if (start.current === null) start.current = t;

      let progress: number;
      if (t < hoverEnd.current) {
        // hover-triggered fast scramble → resolve
        const elapsed = HOVER_MS - (hoverEnd.current - t);
        progress = Math.min(Math.max(elapsed, 0) / HOVER_MS, 1);
      } else {
        // continuous decode loop
        const elapsed = (t - start.current) % CYCLE;
        progress = Math.min(elapsed / DECODE_MS, 1);
      }

      setOut(build(text, progress));
      raf.current = requestAnimationFrame(frame);
    }
    raf.current = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf.current);
      start.current = null;
    };
  }, [text, CYCLE, DECODE_MS, HOLD_MS, HOVER_MS]);

  function onHover() {
    const now = performance.now();
    hoverEnd.current = now + HOVER_MS;
    // align the loop so that when the hover scramble finishes, the loop
    // resumes at the start of the hold phase (fully revealed). this prevents
    // a jarring jump back to a mid-decode state — matches the name's behavior
    // of staying resolved after hover.
    start.current = now + HOVER_MS - DECODE_MS;
  }

  return (
    <span className={className} onMouseEnter={onHover}>
      {out}
    </span>
  );
}
