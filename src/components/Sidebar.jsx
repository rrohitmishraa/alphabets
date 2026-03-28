import { useState } from "react";

const Sidebar = ({ wpm, accuracy, highScores, loading, bestTime }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="hidden lg:block w-full lg:w-1/4 space-y-10">
        <div>
          <p className="text-xs tracking-widest text-[#780116] mb-3 font-['Audiowide']">
            SESSION SUMMARY
          </p>

          <div className="bg-[#f8b538] p-4 sm:p-6 border border-[#780116]/40 rounded-lg shadow-sm space-y-6 sm:space-y-8">
            <div>
              <p className="text-[11px] tracking-widest text-[#780116]/60 mb-2 font-['Audiowide']">
                CURRENT SPEED
              </p>
              <p className="text-[28px] sm:text-[36px] md:text-[44px] font-['Audiowide'] tracking-wide text-[#780116] leading-none">
                {wpm}
                <span className="text-base text-[#780116]/60 ml-2 font-['Inter']">
                  WPM
                </span>
              </p>
            </div>

            <div>
              <p className="text-[11px] tracking-widest text-[#780116]/60 mb-2 font-['Audiowide']">
                HIGHEST ACCURACY
              </p>
              <p className="text-[28px] sm:text-[36px] md:text-[44px] font-['Audiowide'] tracking-wide text-[#780116] leading-none">
                {accuracy}
                <span className="text-base text-[#780116]/60 ml-2 font-['Inter']">
                  %
                </span>
              </p>
            </div>

            <div>
              <p className="text-[11px] tracking-widest text-[#780116]/60 mb-2 font-['Audiowide']">
                PERSONAL BEST
              </p>
              <p className="text-[20px] sm:text-[24px] md:text-[28px] font-['Audiowide'] tracking-wide text-[#780116] leading-none">
                {bestTime ? bestTime.toFixed(2) + "s" : "--"}
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs tracking-widest text-[#780116] mb-3 font-['Audiowide']">
            GLOBAL RANKING
          </p>
          <div className="bg-[#f8b538] border border-[#780116]/40 rounded-lg shadow-sm p-3 sm:p-4 text-sm">
            {loading ? (
              <p className="text-[#780116]/60">Loading...</p>
            ) : (
              highScores.map((entry, i) => (
                <div
                  key={`${entry.name}-${i}`}
                  className={`flex justify-between py-1 ${
                    i === 0 ? "text-[#780116] font-medium" : ""
                  }`}
                >
                  <span>{entry.name}</span>
                  <span>
                    {entry?.time !== undefined && entry?.time !== null
                      ? entry.time.toFixed(1) + "s"
                      : "--"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FLOATING BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-[#780116] text-[#f8b538] w-12 h-12 flex items-center justify-center rounded-full shadow-lg"
      >
        📊
      </button>

      {/* MOBILE STATS PANEL */}
      {open && (
        <div className="lg:hidden fixed inset-0 bg-[#780116]/90 z-50 flex items-end">
          <div className="w-full bg-[#f8b538] p-4 rounded-t-xl max-h-[80vh] overflow-y-auto border-t border-[#780116]/40">
            <div className="flex justify-between items-center mb-4">
              <p className="font-['Audiowide'] text-sm">STATS</p>
              <button onClick={() => setOpen(false)} className="text-[#780116]">
                Close
              </button>
            </div>

            {/* ORIGINAL CONTENT */}
            <div className="space-y-10">
              <div>
                <p className="text-xs tracking-widest text-[#780116] mb-3 font-['Audiowide']">
                  SESSION SUMMARY
                </p>

                <div className="bg-[#f8b538] p-4 sm:p-6 border border-[#780116]/40 rounded-lg shadow-sm space-y-6 sm:space-y-8">
                  <div>
                    <p className="text-[11px] tracking-widest text-[#780116]/60 mb-2 font-['Audiowide']">
                      CURRENT SPEED
                    </p>
                    <p className="text-[28px] sm:text-[36px] md:text-[44px] font-['Audiowide'] tracking-wide text-[#780116] leading-none">
                      {wpm}
                      <span className="text-base text-[#780116]/60 ml-2 font-['Inter']">
                        WPM
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] tracking-widest text-[#780116]/60 mb-2 font-['Audiowide']">
                      HIGHEST ACCURACY
                    </p>
                    <p className="text-[28px] sm:text-[36px] md:text-[44px] font-['Audiowide'] tracking-wide text-[#780116] leading-none">
                      {accuracy}
                      <span className="text-base text-[#780116]/60 ml-2 font-['Inter']">
                        %
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] tracking-widest text-[#780116]/60 mb-2 font-['Audiowide']">
                      PERSONAL BEST
                    </p>
                    <p className="text-[20px] sm:text-[24px] md:text-[28px] font-['Audiowide'] tracking-wide text-[#780116] leading-none">
                      {bestTime ? bestTime.toFixed(2) + "s" : "--"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs tracking-widest text-[#780116] mb-3 font-['Audiowide']">
                  GLOBAL RANKING
                </p>
                <div className="bg-[#f8b538] border border-[#780116]/40 rounded-lg shadow-sm p-3 sm:p-4 text-sm">
                  {loading ? (
                    <p className="text-[#780116]/60">Loading...</p>
                  ) : (
                    highScores.map((entry, i) => (
                      <div
                        key={`${entry.name}-${i}`}
                        className={`flex justify-between py-1 ${
                          i === 0 ? "text-[#780116] font-medium" : ""
                        }`}
                      >
                        <span>{entry.name}</span>
                        <span>
                          {entry?.time !== undefined && entry?.time !== null
                            ? entry.time.toFixed(1) + "s"
                            : "--"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
