export default function PopupModal({
  show,
  playerName,
  setPlayerName,
  onSubmit,
  isSubmitting,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-[#780116]/90 flex items-center justify-center">
      <div className="bg-[#f8b538] p-6 w-[320px] border border-[#780116]/40 rounded-lg shadow-lg">
        <p className="text-sm mb-4 font-['Audiowide'] text-[#780116]">
          New High Score! Enter your name
        </p>

        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full border border-[#780116] bg-[#f8b538] text-[#780116] px-3 py-2 mb-4 outline-none focus:border-[#780116]"
          placeholder="Your name"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isSubmitting) onSubmit();
          }}
        />

        <button
          onClick={onSubmit}
          disabled={!playerName || isSubmitting}
          className="w-full bg-[#780116] text-[#f8b538] py-2 rounded disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {isSubmitting ? "Saving..." : "Save Score"}
        </button>
      </div>
    </div>
  );
}
