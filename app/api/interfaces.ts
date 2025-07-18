import { OsisToBookName } from '~/common/bible-constants';

export type ListResponse<T> = {
  values: T[];
};

export type ListPaginatedResponse<T> = {
  values: T[];
  total: number;
  limit: number;
  offset: number;
  nextPage: number | null;
};

export type ListBible<T> = {
  values: T[];
  book: string;
  chapter: number;
  verse?: number;
  nextBook?: string;
  nextChapter?: number;
  nextVerse?: number;
  previousBook?: string;
  previousChapter?: number;
  previousVerse?: number;
};

export enum ContributorType {
  Individual = 'INDIVIDUAL',
  Conference = 'CONFERENCE',
}

export enum MediaType {
  Audio = 'AUDIO',
  Video = 'VIDEO',
  Text = 'TEXT',
}

export interface IErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

export interface ContributorImage {
  url: string;
  title?: string;
  description?: string;
}

export interface ContributorInfo {
  id: string;
  slug: string;
  fullName: string;
  imageUrl?: string;
  type: ContributorType;
  bookCount: number;
  hymnCount: number;
  sermonCount: number;
}

export interface Contributor {
  id: string;
  slug: string;
  fullName: string;
  bio?: string;
  imageUrl?: string;
  type: ContributorType;
  bookCount: number;
  hymnCount: number;
  sermonCount: number;
  images: ContributorImage[];
  createdAt: string;
}

export interface Sermon {
  id: string;

  contributorSlug: string;
  contributorFullName: string;
  contributorImageUrl?: string;

  title: string;
  description?: string;
  transcript?: string;

  mediaType: MediaType;
  duration: number;
  views: number;

  streamUrl?: string;
  downloadUrl?: string;
  thumbnailUrl?: string;
  srtUrl?: string;
  vttUrl?: string;

  bibleReferences: BiblePassage[];
  topics: Omit<TopicInfo, 'sermonCount'>[];

  createdAt: string;
}

export interface SermonInfo {
  id: string;

  contributorSlug: string;
  contributorFullName: string;
  contributorImageUrl?: string;

  title: string;
  description?: string;

  mediaType: MediaType;
  duration: number;
  views: number;

  streamUrl?: string;
  downloadUrl?: string;
  thumbnailUrl?: string;

  bibleReferences: BiblePassage[];
  topics: { name: string; slug: string }[];

  createdAt: string;
}

export interface Hymn {
  id: string;

  contributorSlug: string;
  contributorFullName: string;
  contributorImageUrl?: string;

  title: string;
  views: number;

  mediaType: MediaType;
  duration: number;

  streamUrl?: string;
  downloadUrl?: string;
}

export interface TopicInfo {
  name: string;
  slug: string;
  sermonCount: number;
}

export interface Topic {
  name: string;
  summary: string;
  sermons: SermonInfo[];
  updatedAt: string;
  createdAt: string;
}

export interface BookChapter {
  number: number;
  title: string;
}

export interface Book {
  id: string;
  title: string;
  chapters: BookChapter[];
  contributor: Contributor;
}

export interface BookInfo {
  id: string;

  contributorSlug: string;
  contributorFullName: string;
  contributorImageUrl: string;

  title: string;
  mediaType: MediaType;
}

// The following bible entities are subject to change
export interface BiblePassage {
  text: string;
  book: string;
  startChapter: number | null;
  startVerse: number | null;
  endChapter: number | null;
  endVerse: number | null;
}

export type BibleLanguages = ListResponse<string>;

export interface BibleBook {
  id: string;
  name: string;
  order: number;
  numberOfChapters: number;
}

export interface CommentaryBook extends BibleBook {
  introduction?: string;
}

export interface BibleTranslation {
  id: string;
  name: string;
  shortName: string;
  website: string;
  licenseUrl: string;
  language: string;
  textDirection: string;
  isComplete: boolean;
  books: BibleBook[];
}

export interface CommentaryTranslation {
  id: string;
  name: string;
  shortName: string;
  website: string;
  licenseUrl: string;
  language: string;
  textDirection: string;
  isComplete: boolean;
  books: CommentaryBook[];
}

export interface BibleCommentary {
  id: string;
  name: string;
  website: string;
  licenseUrl: string;
  englishName: string;
  language: string;
  textDirection: string;
  sha256: string;
}

export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;

  translationId: string;
  translationName: string;

  text: string;
  contentJson: string;
}

export interface BibleParallel {
  book: string;
  chapter: number;
  verse: number;

  verses: BibleVerse[];

  contextJson: string;
  summary?: string;
}

export interface CommentaryChapter {
  book: string;
  chapter: number;
  id: string;
  name: string;
  author: string;
  introduction?: string;
  contentJson: string;
}

export interface CommentaryVerse {
  book: string;
  chapter: number;
  verse: number;

  id: string;
  name: string;
  author?: string;

  text: string;
  contentJson: string;
}

export interface BibleChapter {
  number: number;
  bookId: keyof OsisToBookName;
  translationId: string;
  translationName: string;
  json: string;
  streamUrl?: string;
  // verses: Verse[];
  // book: Book;
  // footnotes: Footnote[];
  nextChapterNumber?: number;
  nextBookId?: keyof OsisToBookName;
  previousChapterNumber?: number;
  previousBookId?: keyof OsisToBookName;
}
