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
