import { useState, useEffect, useRef } from "react";
import { getScores, saveScore } from "../services/scoreService";

export default function useTypingGame() {
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("0.00");
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef(null);
  const inputRef = useRef(null);
  const lastKeyTimeRef = useRef(null);
  const [alphabetTimes, setAlphabetTimes] = useState([]);
  const [missed, setMissed] = useState(0);
  const [highScores, setHighScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [pendingScore, setPendingScore] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [bestTime, setBestTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const scores = await getScores();
        const topScores = scores.sort((a, b) => a.time - b.time).slice(0, 3);
        setHighScores(topScores);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
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
        if (isSubmitting) return;
        handleReset();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isSubmitting]);

  useEffect(() => {
    const savedName = localStorage.getItem("playerName");
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  useEffect(() => {
    const savedBest = localStorage.getItem("bestTime");
    if (savedBest) {
      setBestTime(parseFloat(savedBest));
    }
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

  const nextExpectedChar = (len) => {
    return "abcdefghijklmnopqrstuvwxyz"[len];
  };

  const handleInputChange = (e) => {
    if (isFinished || showPopup) return;

    const inputValue = e.target.value;

    if (inputValue.length > 0) {
      const currentChar = inputValue[inputValue.length - 1].toLowerCase();

      if (typedText.length === 0) {
        setElapsedTime("0.00");
      }

      if (currentChar === nextExpectedChar(typedText.length)) {
        if (!timerRunning) {
          startTimer(Date.now());
        }

        const now = Date.now();
        const delta = lastKeyTimeRef.current
          ? (now - lastKeyTimeRef.current) / 1000
          : 0;

        lastKeyTimeRef.current = now;
        setAlphabetTimes((prev) => [...prev, delta]);

        if (inputValue === "abcdefghijklmnopqrstuvwxyz") {
          stopTimer();
          const totalTime = (Date.now() - (startTime ?? Date.now())) / 1000;
          setElapsedTime(totalTime.toFixed(2));
          updateHighScores(totalTime);
          setIsFinished(true);
          const prevBest = localStorage.getItem("bestTime");
          if (!prevBest || totalTime < parseFloat(prevBest)) {
            localStorage.setItem("bestTime", totalTime);
            setBestTime(totalTime);
          }
        }

        setTypedText(inputValue);
      } else {
        setMissed((m) => m + 1);
      }
    }
  };

  const updateHighScores = (newTime) => {
    const qualifies =
      highScores.length < 3 ||
      parseFloat(newTime) < parseFloat(highScores[2]?.time);

    if (qualifies) {
      setPendingScore(parseFloat(newTime));
      setShowPopup(true);
    }
  };

  const refreshScores = async () => {
    try {
      const scores = await getScores();
      const top = scores.sort((a, b) => a.time - b.time).slice(0, 3);
      setHighScores(top);
    } catch (err) {
      console.error("Failed to refresh scores", err);
    }
  };

  const submitScore = async () => {
    if (
      isSubmitting ||
      !playerName.trim() ||
      playerName.trim().length < 2 ||
      pendingScore == null
    )
      return;

    try {
      setIsSubmitting(true);
      await saveScore({
        name: playerName,
        time: pendingScore,
      });

      await refreshScores();
      localStorage.setItem("playerName", playerName);
      setShowPopup(false);
      setPlayerName("");
      setPendingScore(null);
    } catch (err) {
      console.error("Error saving score:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTypedText("");
    setElapsedTime("0.00");
    setStartTime(null);
    setTimerRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setAlphabetTimes([]);
    setMissed(0);
    lastKeyTimeRef.current = null;
    setIsFinished(false);
  };

  const totalSeconds = parseFloat(elapsedTime) || 0;
  const charsTyped = typedText.length;

  const wpm =
    totalSeconds > 0 ? Math.round(charsTyped / 5 / (totalSeconds / 60)) : 0;

  const accuracy =
    charsTyped + missed > 0
      ? ((charsTyped / (charsTyped + missed)) * 100).toFixed(1)
      : 100;

  return {
    typedText,
    elapsedTime,
    missed,
    alphabetTimes,
    wpm,
    accuracy,
    highScores,
    loading,
    showPopup,
    playerName,
    inputRef,
    handleInputChange,
    submitScore,
    setPlayerName,
    handleReset,
    isFinished,
    bestTime,
    isSubmitting,
  };
}
