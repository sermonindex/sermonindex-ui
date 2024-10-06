interface Contributor {
  id: number;

  firstName: string;
  lastName: string;
  fullName: string;
  description?: string;
  imageUrl?: string;
  featured: boolean;
}

interface Topic {
  id: number;
  name: string;
}

interface BibleReference {
  id: number;

  book: string;

  startChapter: number;
  endChapter: number;

  startVerse: number;
  endVerse: number;

  text: string;

  sermonId: number;

  createdAt: string;
  updatedAt: string;
}

interface Sermon {
  id: number;
  mysqlId?: number;

  contributor: Partial<Contributor>;

  title: string;
  description?: string;

  audioUrl?: string;
  videoUrl?: string;

  bibleReferences: BibleReference[];
  topics: Topic[];

  hits: number;
  featured: boolean;

  preachedAt?: Date;

  createdAt: string;
  updatedAt: Date;
}
