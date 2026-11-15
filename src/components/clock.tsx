'use client'

import { useEffect, useState } from "react";

/**
 * live ist clock. updates every second.
 * pretends nothing happened if you blink.
 */
export default function Clock() {
  const [time, setTime] = useState<string>("--:--:--");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });

    function tick() {
      setTime(formatter.format(new Date()));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span suppressHydrationWarning>{time} ist</span>;
}
