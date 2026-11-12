"use client";

import { useEffect, useState } from "react";

/** End of `endDate` (23:59:59 India time) as a timestamp. */
const endOf = (endDate: string) => Date.parse(`${endDate}T23:59:59+05:30`);
const DAY = 86400000;

/**
 * Live countdown until the offer ends: a short status line ("Ends in", "Last day, hurry!")
 * and Days : Hrs : Min : Sec tiles that shrink on phones.
 */
export default function OfferCountdown({ endDate }: { endDate: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const left = now === null ? null : Math.max(0, endOf(endDate) - now);
  const ended = left === 0;
  const lastDay = left !== null && left > 0 && left < DAY;

  const units: [string, number | null][] = [
    ["Days", left === null ? null : Math.floor(left / DAY)],
    ["Hrs", left === null ? null : Math.floor(left / 3600000) % 24],
    ["Min", left === null ? null : Math.floor(left / 60000) % 60],
    ["Sec", left === null ? null : Math.floor(left / 1000) % 60],
  ];
  // On the last day the "00 days" tile is noise: drop it
  const shown = lastDay ? units.slice(1) : units;

  if (ended) {
    return <p className="text-sm font-medium text-white/70">This offer has ended</p>;
  }

  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
        {lastDay ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-[livePing_1.4s_ease-out_infinite] rounded-full bg-white" />
              <span className="relative h-2 w-2 rounded-full bg-white" />
            </span>
            <span className="text-white">Last day · hurry!</span>
          </>
        ) : (
          "Offer ends in"
        )}
      </p>
      <div className="flex items-start gap-1 sm:gap-1.5" role="timer" aria-label="Time left in this offer">
        {shown.map(([label, n], i) => (
          <div key={label} className="flex items-start gap-1 sm:gap-1.5">
            <div className="text-center">
              <span className="block min-w-[2.6rem] rounded-lg bg-white px-1.5 py-1.5 font-mono text-lg font-bold tabular-nums leading-none text-neutral-950 sm:min-w-[3.1rem] sm:py-2 sm:text-2xl">
                {n === null ? "--" : String(n).padStart(2, "0")}
              </span>
              <span className="mt-1 block text-[9px] uppercase tracking-[0.16em] text-white/50 sm:text-[10px]">{label}</span>
            </div>
            {i < shown.length - 1 && <span className="pt-1.5 text-base font-semibold text-white/30 sm:pt-2 sm:text-xl">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
