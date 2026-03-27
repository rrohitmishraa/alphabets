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
      <p className="text-xs tracking-widest text-gray-400 mb-6 font-['Audiowide']">
        CHARACTER LATENCY ANALYSIS
      </p>

      <div className="grid grid-cols-9 gap-5">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l, i) => {
          const time = alphabetTimes[i];

          let barColor = "bg-gray-200";
          let textColor = "text-gray-700";

          if (time !== undefined) {
            if (time < 0.1) barColor = "bg-[#7db7a4]";
            else if (time < 0.2) barColor = "bg-[#a5b4fc]";
            else barColor = "bg-[#e6b3b3]";

            if (time >= 0.3) textColor = "text-red-500";
          }

          const width = time
            ? maxTime
              ? `${(time / maxTime) * 100}%`
              : "0%"
            : "0%";

          return (
            <div
              key={i}
              className={`bg-[#eef2f5] border ${
                time === maxTime && time !== undefined
                  ? "border-red-400"
                  : "border-gray-100"
              } p-4 text-center flex flex-col justify-between h-[100px] transition-transform ${
                time === maxTime ? "scale-[1.03]" : ""
              }`}
            >
              <p className="text-xs text-gray-500 font-['Audiowide']">{l}</p>

              <p className={`text-sm font-['Inter'] ${textColor}`}>
                {time !== undefined ? time.toFixed(2) + "s" : "--"}
              </p>

              <div className="mt-2 h-[3px] w-full bg-gray-200 overflow-hidden">
                <div
                  className={`h-full ${barColor} transition-all duration-500 ease-out`}
                  style={{ width: animate ? width : "0%" }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {alphabetTimes.length > 0 && (
        <p className="mt-6 text-sm text-gray-500 font-['Inter']">
          Weakest key:{" "}
          <span className="text-red-500 font-medium">
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ"[alphabetTimes.indexOf(maxTime)]}
          </span>
        </p>
      )}
    </div>
  );
}
