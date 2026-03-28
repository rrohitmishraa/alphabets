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
    isSubmitting,
    handleReset,
  } = useTypingGame();

  return (
    <div className="min-h-screen bg-[#f8b538] text-[#780116] flex flex-col font-['Inter']">
      {/* HEADER */}
      <Header />

      {/* MAIN */}
      <div className="flex flex-col lg:flex-row flex-1 px-4 md:px-8 py-6 gap-6">
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
            handleReset={handleReset}
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
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default SpeedyAlphabet;
