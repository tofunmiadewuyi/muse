export const convertTimeToReadable = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export const copyCode = (value: string) => {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(value)
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
  }
};
