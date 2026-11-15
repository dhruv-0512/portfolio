'use client'

import { useEffect, useState } from "react";

/**
 * live ist clock. updates every second.
 * pretends nothing happened if you blink.
 */
export default function Clock() {
  const [time, setTime] = useState<string>("--:--:--");

  useEffect(() => {
    function tick() {
      const now = new Date();
      // ist = utc + 5:30
      const ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000);
      const hh = String(ist.getUTCHours()).padStart(2, "0");
      const mm = String(ist.getUTCMinutes()).padStart(2, "0");
      const ss = String(ist.getUTCSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span suppressHydrationWarning>{time} ist</span>;
}
