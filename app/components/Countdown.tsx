"use client";

import { useEffect, useState } from "react";

export function Countdown({ targetDate }: { targetDate: string }) {
  const [time, setTime] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(targetDate).getTime() - Date.now();

      if (diff <= 0) {
        setTime({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const format = (n: number) => n.toString().padStart(2, "0");

      setTime({
        days: format(days),
        hours: format(hours),
        minutes: format(minutes),
        seconds: format(seconds),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="text-center mt-6">
      {/* CONTENEDOR */}
      <div className="flex justify-center items-center gap-2 sm:gap-4">

        {[
          { label: "Días", value: time.days },
          { label: "Horas", value: time.hours },
          { label: "Min", value: time.minutes },
          { label: "Seg", value: time.seconds },
        ].map((item) => (
          <div
            key={item.label}
            className="
              flex flex-col items-center justify-center
              px-2 py-2 sm:px-4 sm:py-3
              min-w-[55px] sm:min-w-[70px]
              rounded-xl shadow-md scalable-title
            "
            style={{
              background: "var(--color-bg-main)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div
              className="
                text-xl sm:text-3xl
                font-bold 
              "
              style={{ color: "var(--color-primary)" }}
            >
              {item.value}
            </div>

            <div
              className="
                text-[10px] sm:text-xs
                mt-1
              "
              style={{ color: "var(--color-text-soft)" }}
            >
              {item.label}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}