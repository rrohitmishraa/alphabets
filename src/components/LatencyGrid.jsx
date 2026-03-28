import React, { useEffect, useState } from "react";

export default function LatencyGrid({ alphabetTimes }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // trigger animation after mount / update
    const t = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(t);
  }, [alphabetTimes]);

  const maxTime = Math.max(...alphabetTimes, 0);

  return (
    <div className="mt-12">
      <p className="text-xs tracking-widest text-[#780116]/60 mb-6 font-['Audiowide']">
        CHARACTER LATENCY ANALYSIS
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-3 sm:gap-4 md:gap-5">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l, i) => {
          const time = alphabetTimes[i];

          let barColor = "bg-gray-200";
          let textColor = "text-gray-700";

          if (time !== undefined) {
            if (time < 0.1)
              barColor = "bg-green-500"; // fast (clear green)
            else if (time < 0.2)
              barColor = "bg-gray-300"; // medium (neutral)
            else barColor = "bg-[#780116]"; // slow (deep red)

            if (time >= 0.3) textColor = "text-[#780116]";
          }

          const width = time
            ? maxTime
              ? `${(time / maxTime) * 100}%`
              : "0%"
            : "0%";

          return (
            <div
              key={i}
              className={`bg-[#f8b538] border ${
                time === maxTime && time !== undefined
                  ? "border-[#780116]"
                  : "border-[#780116]/30"
              } p-4 text-center flex flex-col justify-between h-[100px] transition-transform ${
                time === maxTime ? "scale-[1.03]" : ""
              }`}
            >
              <p className="text-xs text-[#780116]/70 font-['Audiowide']">
                {l}
              </p>

              <p className={`text-sm font-['Inter'] ${textColor}`}>
                {time !== undefined ? time.toFixed(2) + "s" : "--"}
              </p>

              <div className="mt-2 h-[3px] w-full bg-[#780116]/10 overflow-hidden">
                <div
                  className={`h-full ${barColor} transition-all duration-500 ease-out`}
                  style={{ width: animate ? width : "5%" }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {alphabetTimes.length > 0 && (
        <p className="mt-6 text-sm text-[#780116]/70 font-['Inter']">
          Weakest key:{" "}
          <span className="text-[#780116] font-medium">
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ"[alphabetTimes.indexOf(maxTime)]}
          </span>
        </p>
      )}
    </div>
  );
}
