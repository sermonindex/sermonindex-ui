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
