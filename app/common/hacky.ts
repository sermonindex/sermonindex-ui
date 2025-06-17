/// This file contains hacks that should be addressed in the future, but exist for now...

/**
 * Generates a fallback CDN URL from an archive.org sermon URL.
 *
 * @param url The original URL, expected to be from archive.org.
 * Example: "https://archive.org/download/SERMONINDEX_SID25315/SID25315.mp3"
 * @returns A new fallback URL pointing to the b-cdn.net server, or null if the input
 * URL is not a valid archive.org sermon URL.
 *
 * Notes: This only works for audio files that fail on archive
 */
export function getMediaFallbackUrl(url: string | undefined): string | null {
  // 1. Check if the URL is a valid archive.org URL.
  if (!url || !url.includes('archive.org')) {
    return null;
  }

  // 2. Use a regular expression to find and extract the full SID (e.g., "SID25315").
  // This regex looks for "SID" followed by 4 or 5 digits.
  const sidMatch = url.match(/SID(\d{4,5})/);

  if (!sidMatch) {
    return null;
  }

  const fullSid = sidMatch[0]; // e.g., "SID25315"
  const sidNumbers = sidMatch[1]; // e.g., "25315"

  let directory: string;

  // 3. Use the first one or two digits of the SID number to determine the folder (directory).
  if (sidNumbers.length === 5) {
    // For a 5-digit SID, the directory is the first two digits.
    directory = sidNumbers.substring(0, 2); // e.g., "25"
  } else if (sidNumbers.length === 4) {
    // For a 4-digit SID, the directory is the first digit.
    directory = sidNumbers.substring(0, 1); // e.g., for "SID1234", this would be "1"
  } else {
    // If the SID number length is not 4 or 5, it's an unexpected format.
    return null;
  }

  // 4. Construct the final fallback URL using the determined directory and the full SID.
  return `http://sermonindex1.b-cdn.net/${directory}/${fullSid}.mp3`;
}
