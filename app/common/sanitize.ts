/// Sanitize that a string has some valid contents
export function hasContent(str: string | undefined): boolean {
  str = str || '';
  str = str.trim();
  return (
    str !== '' &&
    str !== null &&
    str !== undefined &&
    str !== 'null' &&
    str !== 'undefined' &&
    str !== ' ' &&
    str !== 'nil'
  );
}

/// Sanitize a number to be a valid number
export function isNumber(num: number | undefined): boolean {
  if (num !== null && num !== undefined) {
    return !isNaN(num);
  }
  return false;
}

/// Safely converts a string to an integer.
export function safeParseInt(value: string): number | null {
  if (value.trim() === '') {
    return null;
  }

  const num = Number(value);

  if (Number.isNaN(num) || !Number.isInteger(num)) {
    return null;
  }

  return num;
}
