export default function PopupModal({
  show,
  playerName,
  setPlayerName,
  onSubmit,
  isSubmitting,
}) {
  if (!show) return null;

  return (
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
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isSubmitting) onSubmit();
          }}
        />

        <button
          onClick={onSubmit}
          disabled={!playerName || isSubmitting}
          className="w-full bg-black text-white py-2 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Score"}
        </button>
      </div>
    </div>
  );
}
