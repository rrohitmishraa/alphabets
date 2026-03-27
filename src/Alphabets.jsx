import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import TypingBox from "./components/TypingBox";
import Footer from "./components/Footer";
import PopupModal from "./components/PopupModal";
import LatencyGrid from "./components/LatencyGrid";

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
          <TypingBox
            elapsedTime={elapsedTime}
            missed={missed}
            typedText={typedText}
            inputRef={inputRef}
            handleInputChange={handleInputChange}
          />

          {/* LATENCY SECTION (static for now) */}
          <LatencyGrid alphabetTimes={alphabetTimes} />
        </div>
      </div>

      {/* FOOTER */}
      <Footer />

      {showPopup && (
        <PopupModal
          show={showPopup}
          playerName={playerName}
          setPlayerName={setPlayerName}
          onSubmit={submitScore}
        />
      )}
    </div>
  );
};

export default SpeedyAlphabet;
