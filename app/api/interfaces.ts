import { hasContent } from '~/common/sanitize';

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
  fullName: string;
  fullNameSlug: string;
  description?: string;
  imageUrl?: string;
  featured: boolean;
  type: ContributorType;
  createdAt: string;
  updatedAt: string;
  sermonCount: number;
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

  bibleReferences: string[];
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
