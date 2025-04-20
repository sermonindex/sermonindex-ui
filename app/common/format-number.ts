export function formatNumber(value: number | string | undefined | null) {
  const num = value === undefined || value === null ? 0 : Number(value);

  if (num >= 1e6) {
    return (num / 1e6).toFixed(0) + 'M';
  } else if (num >= 10e3) {
    return (num / 1e3).toFixed(0) + 'K';
  } else if (num < 10e3 && num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Converts a duration in seconds (float/number) into a time string format.
 * If the duration is one hour or more, the format is "hh:mm:ss".
 * If the duration is less than one hour, the format is "mm:ss".
 * Handles invalid or negative inputs by returning "00:00".
 *
 * @param seconds - The total duration in seconds.
 * @returns A formatted time string (hh:mm:ss or mm:ss).
 */
export function convertSecondsToTimeString(
  seconds: number | undefined,
): string {
  // 1. Handle invalid, infinite, or negative inputs
  if (seconds === undefined || !Number.isFinite(seconds) || seconds < 0) {
    return '00:00'; // Return default for invalid or negative times
  }

  // 2. Floor the seconds to get whole seconds
  const totalSeconds = Math.floor(seconds);

  // 3. Calculate hours, minutes, and remaining seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secondsPart = totalSeconds % 60;

  // 4. Format minutes and seconds with leading zeros using padStart
  // number.toString() converts the number to a string
  // padStart(2, '0') ensures the string is at least 2 characters long, padding with '0' if needed
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = secondsPart.toString().padStart(2, '0');

  // 5. Determine the final format based on whether hours are present
  if (hours > 0) {
    // Also format hours with leading zero (less common, but consistent)
    const formattedHours = hours.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    return `${formattedMinutes}:${formattedSeconds}`;
  }
}
