export function formatDownloads(downloads: number | string | undefined) {
  const value = downloads === undefined ? 0 : Number(downloads);

  if (value >= 1e6) {
    return (value / 1e6).toFixed(0) + 'M';
  } else if (value >= 1e3) {
    return (value / 1e3).toFixed(0) + 'K';
  }
  return value.toString();
}
