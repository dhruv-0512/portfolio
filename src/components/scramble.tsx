'use client'

import { useEffect, useRef, useState } from "react";

/**
 * text that scrambles briefly when hovered, then settles.
 * tiny easter egg — nothing loud.
 */
const CHARS = "01abcdefghijklmnopqrstuvwxyz_/-";

export default function Scramble({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);
  const raf = useRef(0);
  const frame = useRef(0);
  const hovering = useRef(false);

  useEffect(() => {
    return () => cancelAnimationFrame(raf.current);
  }, []);

  function start() {
    hovering.current = true;
    frame.current = 0;
    const totalFrames = 24;

    const step = () => {
      frame.current++;
      const f = frame.current;
      const progress = f / totalFrames;
      // revealed characters settle left-to-right
      const out = text
        .split("")
        .map((ch, i) => {
          const revealAt = i / text.length;
          if (progress >= revealAt) return ch;
          if (ch === " ") return " ";
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");
      setDisplay(out);

      if (f < totalFrames) {
        raf.current = requestAnimationFrame(step);
      } else {
        setDisplay(text);
        hovering.current = false;
      }
    };
    raf.current = requestAnimationFrame(step);
  }

  return (
    <span
      onMouseEnter={start}
      className="cursor-pointer select-none"
    >
      {display}
    </span>
  );
}
