const TypingBox = ({
  elapsedTime,
  missed,
  typedText,
  inputRef,
  handleInputChange,
  isFinished,
  handleReset,
}) => (
  <div
    className="bg-[#f8b538] rounded-none px-4 sm:px-6 md:px-8 py-8 md:py-12 cursor-text border border-[#780116]/40"
    onClick={() => {
      inputRef.current?.focus();

      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }}
  >
    <div className="flex flex-row justify-end items-center gap-6 mb-6">
      <div className="text-right">
        <p className="text-[9px] sm:text-[10px] tracking-widest text-[#780116]/60 font-['Audiowide']">
          TIMER
        </p>
        <p className="text-[18px] sm:text-[20px] md:text-[22px] font-['Audiowide'] tracking-wide text-[#780116] leading-none">
          {elapsedTime}
        </p>
      </div>

      <div className="text-right">
        <p className="text-[9px] sm:text-[10px] tracking-widest text-[#780116]/60 font-['Audiowide']">
          MISSED
        </p>
        <p className="text-[18px] sm:text-[20px] md:text-[22px] font-['Audiowide'] tracking-wide text-[#780116] leading-none">
          {missed}
        </p>
      </div>
    </div>

    <div className="text-center text-[32px] sm:text-[48px] md:text-[72px] lg:text-[96px] font-['Audiowide'] space-y-3">
      {["abcdefghij", "klmnopqrst", "uvwxyz"].map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex justify-center gap-2 sm:gap-4 md:gap-5"
        >
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
                className={
                  isDone
                    ? "text-[#780116]"
                    : isNext
                      ? "text-[#780116] underline underline-offset-4 decoration-[#780116]/40"
                      : "text-[#780116]/40"
                }
              >
                {letter}
              </span>
            );
          })}
        </div>
      ))}
    </div>
    {isFinished && (
      <div className="mt-6 text-center text-[#780116] font-['Audiowide'] text-lg">
        COMPLETED in {elapsedTime}s 🚀
      </div>
    )}

    <input
      ref={inputRef}
      type="text"
      value={typedText}
      onChange={handleInputChange}
      className="absolute inset-0 opacity-0"
      disabled={isFinished}
      autoFocus
      style={{ fontSize: "16px" }}
    />

    <div className="flex flex-col items-center gap-2 mt-10 text-[11px] text-[#780116]/70">
      <span className="hidden sm:inline">
        <span className="px-2 py-1 bg-[#780116] text-[#f8b538]">TAB</span>
        <span className="ml-3">PRESS TO RESTART</span>
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleReset();
          inputRef.current?.focus();
        }}
        className="sm:hidden px-4 py-2 bg-[#780116] text-[#f8b538]"
      >
        Restart
      </button>
    </div>
  </div>
);

export default TypingBox;
