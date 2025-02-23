import { OsisToBookName } from '~/common/bible-constants';
import { hasContent } from '~/common/sanitize';

export type ListResponse<T> = {
  values: T[];
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

export interface IErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

export enum ContributorType {
  INDIVIDUAL = 'INDIVIDUAL',
  CONFERENCE = 'CONFERENCE',
}

export interface ContributorImage {
  url: string;
  title: string | null;
  description: string | null;
}

export interface Contributor {
  id: number;
  fullName: string;
  fullNameSlug: string;
  description?: string;
  imageUrl?: string;
  featured: boolean;
  type: ContributorType;
  createdAt: string;
  updatedAt: string;
  sermonCount: number;
  images: ContributorImage[];
}

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

export interface Sermon {
  id: number;
  mysqlId?: number;

  contributorId: number;
  contributorFullName: string;
  contributorFullNameSlug: string;
  contributorImageUrl?: string;

  title: string;
  description?: string;

  audioUrl?: string;
  videoUrl?: string;
  // This is different from videoUrl in that it will always point to
  // a mp4 opposed to a youtube or other streaming service endpoint
  videoDownloadUrl?: string;
  // Captions
  srtUrl?: string;
  vttUrl?: string;

  bibleReferences: BiblePassage[];
  topics: string[];

  hits: number;
  featured: boolean;
  previouslyFeatured: boolean;

  preachedAt?: string;
  updatedAt: string;
  createdAt: string;

  transcript?: string;
}

export enum SermonType {
  Audio = 'Audio',
  Video = 'Video',
  Text = 'Text',
}

export function getSermonType(sermon: Sermon): SermonType {
  if (hasContent(sermon.videoUrl)) {
    return SermonType.Video;
  } else if (hasContent(sermon.audioUrl)) {
    return SermonType.Audio;
  } else if (hasContent(sermon.transcript)) {
    return SermonType.Text;
  }
  return SermonType.Text;
}

export function getSermonUrl(sermon: Sermon): string | undefined {
  return sermon.videoUrl || sermon.audioUrl;
}

export interface Topic {
  name: string;
  sermonCount: number;
}

export interface SermonTopic {
  name: string;
  sermons: Sermon[];
  updatedAt: string;
  createdAt: string;
}

// The following bible entities are subject to change
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
  // verses: Verse[];
  // book: Book;
  // footnotes: Footnote[];
  nextChapterNumber?: number;
  nextBookId?: keyof OsisToBookName;
  previousChapterNumber?: number;
  previousBookId?: keyof OsisToBookName;
}
