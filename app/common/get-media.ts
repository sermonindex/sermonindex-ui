import { MediaElement, MediaType, Sermon } from '~/api/interfaces';

export function getMedia(item: Sermon): MediaElement {
  return (
    item.mediaType === MediaType.Video ? item.video : item.audio
  ) as MediaElement;
}
