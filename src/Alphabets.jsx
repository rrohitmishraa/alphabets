import { useState, useEffect, useRef } from "react";

const Header = () => (
  <div className="flex justify-between items-center px-10 py-6 border-b border-gray-200">
    <div className="flex items-center gap-8">
      <h1 className="font-['Audiowide'] tracking-wider text-lg">ALPHABETS</h1>
    </div>
  </div>
);

const Sidebar = ({ wpm, accuracy, highScores, loading }) => (
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

const SpeedyAlphabet = () => {
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("0.00");
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef(null);
  const inputRef = useRef(null);
  const lastKeyTimeRef = useRef(null);
  const [alphabetTimes, setAlphabetTimes] = useState([]);
  const [missed, setMissed] = useState(0);
  const [highScores, setHighScores] = useState([]); // Initialize state for leaderboard scores
  const [loading, setLoading] = useState(true); // Loading state for async fetch
  const [showPopup, setShowPopup] = useState(false);
  const [pendingScore, setPendingScore] = useState(null);
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    // Fetch the leaderboard when the component is mounted
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/scores`,
        );
        if (response.ok) {
          const scores = await response.json();
          console.log("Fetched scores:", scores); // Log to verify the response

          // Sort the scores by time (ascending) and take the top 3
          const topScores = scores.sort((a, b) => a.time - b.time).slice(0, 3);
          setHighScores(topScores); // Set the top 3 scores to state
        } else {
          console.error("Failed to fetch leaderboard");
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchLeaderboard();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        handleReset();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const startTimer = (startTs) => {
    if (!timerRunning) {
      const now = startTs ?? Date.now();
      setStartTime(now);
      setTimerRunning(true);
      intervalRef.current = setInterval(() => {
        setElapsedTime(((Date.now() - now) / 1000).toFixed(2));
      }, 16);
    }
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimerRunning(false);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length > 0) {
      const currentChar = inputValue[inputValue.length - 1].toLowerCase();

      if (typedText.length === 0) {
        setElapsedTime("0.00");
      }

      if (currentChar === nextExpectedChar(typedText.length)) {
        if (!timerRunning) {
          const now = Date.now();
          startTimer(now);
        }

        const now = Date.now();

        const delta = lastKeyTimeRef.current
          ? (now - lastKeyTimeRef.current) / 1000
          : 0;

        lastKeyTimeRef.current = now;

        setAlphabetTimes((prevTimes) => [...prevTimes, delta]);

        if (inputValue === "abcdefghijklmnopqrstuvwxyz") {
          stopTimer();
          const totalTime = (Date.now() - (startTime ?? Date.now())) / 1000;
          setElapsedTime(totalTime.toFixed(2));
          updateHighScores(totalTime); // Check if this score qualifies for top 3
        }

        setTypedText(inputValue);
      } else {
        setMissed((m) => m + 1);
        return;
      }
    }
  };

  const nextExpectedChar = (currentLength) => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    return alphabet[currentLength];
  };

  const updateHighScores = (newTime) => {
    const qualifiesForTop3 =
      highScores.length < 3 ||
      parseFloat(newTime) < parseFloat(highScores[2]?.time);

    if (qualifiesForTop3) {
      // Store score temporarily and show popup
      setPendingScore(parseFloat(newTime));
      setShowPopup(true);
    }
  };

  const submitScore = async () => {
    if (!playerName || pendingScore == null) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/scores`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: playerName,
            time: pendingScore,
          }),
        },
      );

      if (!response.ok) {
        console.error("Failed to save score");
        return;
      }

      const savedScore = await response.json();

      const updatedScores = [...highScores, savedScore]
        .sort((a, b) => a.time - b.time)
        .slice(0, 3);

      setHighScores(updatedScores);
      setShowPopup(false);
      setPlayerName("");
      setPendingScore(null);
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const handleReset = () => {
    setTypedText("");
    setElapsedTime("0.00");
    setStartTime(null);
    setTimerRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setAlphabetTimes([]);
    setMissed(0);
    lastKeyTimeRef.current = null;
  };

  const totalSeconds = parseFloat(elapsedTime) || 0;
  const charsTyped = typedText.length;
  const wpm =
    totalSeconds > 0 ? Math.round(charsTyped / 5 / (totalSeconds / 60)) : 0;
  const accuracy =
    charsTyped + missed > 0
      ? ((charsTyped / (charsTyped + missed)) * 100).toFixed(1)
      : 100;

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#1c1f23] flex flex-col font-['Inter']">
      {/* HEADER */}
      <Header />

      {/* MAIN */}
      <div className="flex flex-1 px-12 py-10 gap-10">
        {/* SIDEBAR */}
        <Sidebar
          wpm={wpm}
          accuracy={accuracy}
          highScores={highScores}
          loading={loading}
        />

        {/* MAIN PANEL */}
        <div className="flex-1">
          {/* TYPING BOX */}
          <div
            className="bg-[#dfe5ea] rounded-none px-8 py-14 cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="flex justify-end gap-12 mb-6">
              <div className="text-right">
                <p className="text-[10px] tracking-widest text-gray-400 font-['Audiowide']">
                  TIMER
                </p>
                <p className="text-[22px] font-['Audiowide'] tracking-wide text-gray-800 leading-none">
                  {elapsedTime}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] tracking-widest text-gray-400 font-['Audiowide']">
                  MISSED
                </p>
                <p className="text-[22px] font-['Audiowide'] tracking-wide text-red-500 leading-none">
                  {missed}
                </p>
              </div>
            </div>

            <div className="text-center text-[80px] md:text-[96px] font-['Audiowide'] font-normal leading-[1.2] space-y-3">
              {["abcdefghij", "klmnopqrst", "uvwxyz"].map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-5">
                  {row.split("").map((letter, colIndex) => {
                    const index =
                      rowIndex === 0
                        ? colIndex
                        : rowIndex === 1
                          ? colIndex + 10
                          : colIndex + 20;

                    const isDone = index < typedText.length;
                    const isNext = index === typedText.length;

                    return (
                      <span
                        key={index}
                        className={`
                          transition-all duration-150
                          ${
                            isDone
                              ? "text-[#2a2f33]"
                              : isNext
                                ? "text-[#1c1f23] underline underline-offset-4"
                                : "text-[#a0a6ac]"
                          }
                        `}
                      >
                        {letter}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>

            <input
              ref={inputRef}
              type="text"
              value={typedText}
              onChange={handleInputChange}
              className="opacity-0 absolute"
              autoFocus
            />

            <div className="text-center mt-10 text-[11px] text-gray-500 tracking-wide">
              <span className="px-2 py-1 bg-gray-200 rounded-none text-gray-600 font-['Inter']">
                TAB
              </span>
              <span className="ml-3">PRESS TO RESTART</span>
            </div>
          </div>

          {/* LATENCY SECTION (static for now) */}
          <div className="mt-12">
            <p className="text-xs tracking-widest text-gray-400 mb-6 font-['Audiowide']">
              CHARACTER LATENCY ANALYSIS
            </p>

            {(() => {
              const maxTime = Math.max(...alphabetTimes, 0);
              return (
                <>
                  <div className="grid grid-cols-9 gap-5">
                    {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l, i) => {
                      const time = alphabetTimes[i];

                      let barColor = "bg-gray-200";
                      let textColor = "text-gray-700";

                      if (time !== undefined) {
                        if (time < 0.1)
                          barColor = "bg-[#7db7a4]"; // green fast
                        else if (time < 0.2)
                          barColor = "bg-[#a5b4fc]"; // blue medium
                        else barColor = "bg-[#e6b3b3]"; // red slow

                        if (time >= 0.3) textColor = "text-red-500";
                      }

                      return (
                        <div
                          key={i}
                          className={`bg-[#eef2f5] border ${time === maxTime && time !== undefined ? "border-red-400" : "border-gray-100"} rounded-none p-4 text-center flex flex-col justify-between h-[100px] transition-all ${time === maxTime ? "scale-[1.03]" : ""}`}
                        >
                          <p className="text-xs text-gray-500 font-['Audiowide']">
                            {l}
                          </p>

                          <p className={`text-sm font-['Inter'] ${textColor}`}>
                            {time !== undefined ? time.toFixed(2) + "s" : "--"}
                          </p>

                          <div className="mt-2 h-[3px] w-full bg-gray-200">
                            <div
                              className={`h-full ${barColor}`}
                              style={{
                                width: time
                                  ? maxTime
                                    ? `${(time / maxTime) * 100}%`
                                    : "0%"
                                  : "0%",
                              }}
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
                        {
                          "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[
                            alphabetTimes.indexOf(maxTime)
                          ]
                        }
                      </span>
                    </p>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between px-8 py-4 text-xs text-blue-500 border-t border-gray-100">
        <span className="font-['Audiowide']">© 2024 BY UNLINKLY.COM.</span>
        <div className="flex gap-5">
          <span className="text-gray-400">v2.0</span>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 w-[300px] border border-gray-200">
            <p className="text-sm mb-4 font-['Audiowide']">
              New High Score! Enter your name
            </p>

            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full border px-3 py-2 mb-4 outline-none"
              placeholder="Your name"
            />

            <button
              onClick={submitScore}
              className="w-full bg-black text-white py-2"
            >
              Save Score
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeedyAlphabet;
