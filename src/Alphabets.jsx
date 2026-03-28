import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import TypingBox from "./components/TypingBox";
import Footer from "./components/Footer";
import PopupModal from "./components/PopupModal";
import LatencyGrid from "./components/LatencyGrid";
import useTypingGame from "./hooks/useTypingGame";

const SpeedyAlphabet = () => {
  const {
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
    isFinished,
    bestTime,
  } = useTypingGame();

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
          bestTime={bestTime}
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
            isFinished={isFinished}
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
