"use client";

import { useEffect, useState } from "react";

/** End of `endDate` (23:59:59 India time) as a timestamp. */
const endOf = (endDate: string) => Date.parse(`${endDate}T23:59:59+05:30`);

/** Live Days : Hrs : Min : Sec until the offer ends. */
export default function OfferCountdown({ endDate }: { endDate: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const left = now === null ? null : Math.max(0, endOf(endDate) - now);
  const parts =
    left === null
      ? ["--", "--", "--", "--"]
      : [Math.floor(left / 86400000), Math.floor(left / 3600000) % 24, Math.floor(left / 60000) % 60, Math.floor(left / 1000) % 60].map((n) =>
          String(n).padStart(2, "0")
        );
  const labels = ["Days", "Hrs", "Min", "Sec"];

  return (
    <div className="flex items-end gap-1.5 sm:gap-2" aria-label="Time left in this offer" role="timer">
      {parts.map((v, i) => (
        <div key={labels[i]} className="flex items-end gap-1.5 sm:gap-2">
          <div className="text-center">
            <span className="block min-w-[3.1rem] rounded-lg bg-white/10 px-2 py-2 font-mono text-2xl font-semibold tabular-nums text-white ring-1 ring-white/15 sm:min-w-[3.6rem] sm:text-3xl">
              {v}
            </span>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-white/50">{labels[i]}</span>
          </div>
          {i < 3 && <span className="pb-6 text-xl text-white/30">:</span>}
        </div>
      ))}
    </div>
  );
}
