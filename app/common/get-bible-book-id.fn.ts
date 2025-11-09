import {
  BookNameToOsis,
  COMMON_NAME_OSIS_MAP,
  OsisToBookName,
} from './bible-constants';

export function getBibleBookId(value: string | undefined): string {
  if (!value) {
    return BookNameToOsis.Genesis;
  }

  const book = value
    .toLowerCase()
    .replace(/ /g, '')
    .replace(/-/g, '')
    .replace(/_/g, '');

  if (book in OsisToBookName) {
    return book;
  }

  const id = COMMON_NAME_OSIS_MAP.get(book);
  if (id) {
    return id;
  }

  for (let [key, id] of COMMON_NAME_OSIS_MAP) {
    if (book.startsWith(key)) {
      return id;
    }
  }

  // Default to Genesis if we can't find the book
  return BookNameToOsis.Genesis;
}

const newTestamentBooks = new Set<string>([
  'Matthew',
  'Mark',
  'Luke',
  'John',
  'Yochanan', // John in WMB
  'Acts',
  'Romans',
  '1 Corinthians',
  '2 Corinthians',
  'Galatians',
  'Ephesians',
  'Philippians',
  'Colossians',
  '1 Thessalonians',
  '2 Thessalonians',
  '1 Timothy',
  '2 Timothy',
  'Titus',
  'Philemon',
  'Hebrews',
  'James',
  'Jacob', // James in WMB
  '1 Peter',
  '2 Peter',
  '1 John',
  '1 Yochanan', // 1 John in WMB
  '2 John',
  '2 Yochanan', // 2 John in WMB
  '3 John',
  '3 Yochanan', // 3 John in WMB
  'Jude',
  'Judah', // Jude in WMB
  'Revelation',
]);

export function isNewTestament(book: string): boolean {
  return newTestamentBooks.has(book);
}

export function isOldTestament(book: string): boolean {
  return !isNewTestament(book);
}
