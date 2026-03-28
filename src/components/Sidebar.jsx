const Sidebar = ({ wpm, accuracy, highScores, loading, bestTime }) => (
  <div className="w-1/4 space-y-10">
    <div>
      <p className="text-xs tracking-widest text-gray-400 mb-3 font-['Audiowide']">
        SESSION SUMMARY
      </p>

      <div className="bg-[#eef2f5] p-6 border border-gray-100 space-y-8">
        <div>
          <p className="text-[11px] tracking-widest text-gray-400 mb-2 font-['Audiowide']">
            CURRENT SPEED
          </p>
          <p className="text-[44px] font-['Audiowide'] tracking-wide text-blue-600 leading-none">
            {wpm}
            <span className="text-base text-gray-400 ml-2 font-['Inter']">
              WPM
            </span>
          </p>
        </div>

        <div>
          <p className="text-[11px] tracking-widest text-gray-400 mb-2 font-['Audiowide']">
            HIGHEST ACCURACY
          </p>
          <p className="text-[44px] font-['Audiowide'] tracking-wide text-green-600 leading-none">
            {accuracy}
            <span className="text-base text-gray-400 ml-2 font-['Inter']">
              %
            </span>
          </p>
        </div>

        <div>
          <p className="text-[11px] tracking-widest text-gray-400 mb-2 font-['Audiowide']">
            PERSONAL BEST
          </p>
          <p className="text-[28px] font-['Audiowide'] tracking-wide text-purple-600 leading-none">
            {bestTime ? bestTime.toFixed(2) + "s" : "--"}
          </p>
        </div>
      </div>
    </div>

    <div>
      <p className="text-xs tracking-widest text-gray-400 mb-3 font-['Audiowide']">
        GLOBAL RANKING
      </p>
      <div className="bg-white border border-gray-100 p-4 text-sm">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          highScores.map((entry, i) => (
            <div
              key={`${entry.name}-${i}`}
              className="flex justify-between py-1"
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
);

export default Sidebar;
