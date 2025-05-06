export function formatDuration(value: number | string | undefined | null) {
  const num = value === undefined || value === null ? 0 : Number(value);

  if (num >= 3600) {
    const hours = Math.floor(num / 3600);
    const minutes = Math.floor((num % 3600) / 60);
    const seconds = num % 60;
    return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`;
  }

  const minutes = Math.floor(num / 60);
  const seconds = num % 60;
  return `${minutes < 10 ? `0${minutes}` : minutes}:${
    seconds < 10 ? `0${seconds}` : seconds
  }`;
}
