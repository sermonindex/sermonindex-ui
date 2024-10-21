export type ListResponse<T> = {
  values: T[];
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

export interface Contributor {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  description?: string;
  imageUrl?: string;
  featured: boolean;
  type: ContributorType;
  createdAt: string;
  updatedAt: string;
}

export interface Sermon {
  id: number;
  mysqlId?: number;

  contributorId: number;
  contributorFullName: string;
  contributorImageUrl?: string;

  title: string;
  description?: string;

  // oldAudioUrl: string;
  audioUrl?: string;
  videoUrl?: string;

  bibleReferences: string[];
  topics: string[];

  hits: number;
  featured: boolean;
  // previouslyFeatured: boolean;

  preachedAt?: string;
  updatedAt: string;
  createdAt: string;
}
