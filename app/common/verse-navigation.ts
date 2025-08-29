import {BibleChapter} from "~/api/interfaces";

export interface VerseNavigation {
    previousBook: string | null;
    previousChapter: number | null;
    previousVerse: number | null;
    nextBook: string | null;
    nextChapter: number | null;
    nextVerse: number | null;
    isFirstVerseOfGenesis: boolean;
    isLastVerseOfRevalation: boolean;
}

export function calculateVerseNavigation(
    book: string,
    chapter: number,
    verse: number,
    chapterData: BibleChapter,
    previousChapterData: BibleChapter | null,
): VerseNavigation {

    let previousBook: string | null = null;
    let previousChapter: number | null = null;
    let previousVerse: number | null = null;
    let nextBook: string | null = null;
    let nextChapter: number | null = null;
    let nextVerse: number | null = null;
    let isFirstVerseOfGenesis: boolean;
    let isLastVerseOfRevalation: boolean;

    isFirstVerseOfGenesis = false;
    isLastVerseOfRevalation = false;

    if (book === 'GEN' && chapter === 1 && verse === 1) {
        isFirstVerseOfGenesis = true;
    }

    if (book === 'REV' && chapter === 22 && verse === 21) {
        isLastVerseOfRevalation = true;
    }

    // Defaults
    previousBook = book;
    previousChapter = chapter;
    nextBook = book;
    nextChapter = chapter;

    if (verse === 1) {
        previousVerse = previousChapterData?.verses.length - 1;
        previousBook = chapterData.previousBookId;
        previousChapter = chapterData.previousChapterNumber;
    } else {
        previousVerse = verse - 1;
    }

    if (verse === chapterData.verses.length - 1) {
        nextVerse = 1;
        nextBook = chapterData.nextBookId;
        nextChapter = chapterData.nextChapterNumber;
    } else {
        nextVerse = verse + 1;
    }

    return {
        previousBook,
        previousChapter,
        previousVerse,
        nextBook,
        nextChapter,
        nextVerse,
        isFirstVerseOfGenesis,
        isLastVerseOfRevalation
    };
}