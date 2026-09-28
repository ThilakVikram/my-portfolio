"use client";

import { useEffect, useRef, useState } from "react";

// "the" + "rtv" (R Thilak Vikram's initials) + ".in" -- the domain doubles
// as initials before the logo decodes into the full name.
const HANDLE = "thertv.in";
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const STEP_MS = 40;
const DELAY_MS = 2000; // how long the handle sits before it decodes

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

type CharPlan = { from: string; to: string; start: number; end: number };

// Each character scrambles for a random window before locking into the target,
// so letters resolve at slightly different times instead of all at once.
function planTransition(from: string, to: string): CharPlan[] {
  const length = Math.max(from.length, to.length);
  return Array.from({ length }, (_, i) => {
    const start = Math.floor(Math.random() * 8);
    return { from: from[i] ?? "", to: to[i] ?? "", start, end: start + 4 + Math.floor(Math.random() * 8) };
  });
}

// Nav logo: shows the domain handle, then after a beat decodes into the full
// name, e.g. <thertv.in /> -> <Thilak Vikram R />. Replays on hover.
export default function BrandMark({ name }: { name: string }) {
  const finalText = name || "Portfolio";
  const [display, setDisplay] = useState(HANDLE);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const running = useRef(false);

  const play = () => {
    if (running.current) return;
    running.current = true;
    setDisplay(HANDLE);

    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    timer.current = setTimeout(() => {
      if (reduceMotion) {
        setDisplay(finalText);
        running.current = false;
        return;
      }

      const plan = planTransition(HANDLE, finalText);
      let frame = 0;

      const tick = () => {
        let settled = true;
        let out = "";
        for (const c of plan) {
          if (frame >= c.end) {
            out += c.to;
          } else if (frame >= c.start) {
            out += randomChar();
            settled = false;
          } else {
            out += c.from;
            settled = false;
          }
        }
        setDisplay(out);
        frame++;
        if (!settled) {
          timer.current = setTimeout(tick, STEP_MS);
        } else {
          running.current = false;
        }
      };
      tick();
    }, DELAY_MS);
  };

  useEffect(() => {
    // Deferred so the first setState happens outside the effect's own call
    // stack (avoids the synchronous-setState-in-effect lint rule).
    const kickoff = setTimeout(play, 0);
    return () => {
      clearTimeout(kickoff);
      clearTimeout(timer.current);
      running.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalText]);

  return (
    <span onMouseEnter={play} className="inline-block cursor-pointer whitespace-nowrap tabular-nums">
      &lt;{display} /&gt;
    </span>
  );
}
