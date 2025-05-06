import { FaVolumeUp } from 'react-icons/fa';
import { FaVideo } from 'react-icons/fa6';
import { IoDocumentText } from 'react-icons/io5';
import { MediaType } from '~/api/interfaces';

export interface MediaIconProps {
  mediaType: MediaType;
}

export const MediaIcon = ({ mediaType }: MediaIconProps) => {
  if (mediaType === MediaType.Video) {
    return <FaVideo />;
  } else if (mediaType === MediaType.Audio) {
    return <FaVolumeUp />;
  } else if (mediaType === MediaType.Text) {
    return <IoDocumentText />;
  }
  // todo: other media types might be added like book, quote, short, etc.
  return null;
};
