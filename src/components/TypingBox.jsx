const TypingBox = ({
  elapsedTime,
  missed,
  typedText,
  inputRef,
  handleInputChange,
  isFinished,
}) => (
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

    <div className="text-center text-[80px] md:text-[96px] font-['Audiowide'] space-y-3">
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
                className={
                  isDone
                    ? "text-[#2a2f33]"
                    : isNext
                      ? "text-[#1c1f23] underline underline-offset-4"
                      : "text-[#a0a6ac]"
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
      <div className="mt-6 text-center text-green-600 font-['Audiowide'] text-lg">
        COMPLETED in {elapsedTime}s 🚀
      </div>
    )}

    <input
      ref={inputRef}
      type="text"
      value={typedText}
      onChange={handleInputChange}
      className="opacity-0 absolute"
      disabled={isFinished}
      autoFocus
    />

    <div className="text-center mt-10 text-[11px] text-gray-500 tracking-wide">
      <span className="px-2 py-1 bg-gray-200 text-gray-600">TAB</span>
      <span className="ml-3">PRESS TO RESTART</span>
    </div>
  </div>
);

export default TypingBox;
