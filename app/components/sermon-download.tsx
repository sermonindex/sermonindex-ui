import React, { useState } from 'react';
import {
  FaCheck,
  FaRegClosedCaptioning,
  FaRegFileAudio,
  FaRegFileLines,
  FaRegFilePdf,
  FaRegFileVideo,
} from 'react-icons/fa6';
import { TbFaceIdError } from 'react-icons/tb';
import { MediaType, Sermon } from '~/api/interfaces';
import {
  downloadMP3,
  downloadMP4,
  downloadPDF,
  downloadPlainText,
  downloadUrl,
} from '~/common/download';
import { getMedia } from '~/common/get-media';
import { hasContent } from '~/common/sanitize';
import { ClickableText } from '~/components/section';
import { LoadingSpinner } from '~/components/spinner';

interface SermonDownloadProps {
  sermon: Sermon;
}

interface DownloadItemProps {
  displayText: string;
  downloadCallback: CallableFunction;
  data: any;
  filename: string;
  icon: React.ReactElement;
}

function shouldRenderContent(data: any): boolean {
  return (
    (typeof data === 'string' && hasContent(data)) ||
    (typeof data === 'object' && data !== null)
  );
}

export const DownloadItem = ({
  displayText,
  downloadCallback,
  data,
  filename,
  icon,
}: DownloadItemProps) => {
  const [loading, setLoading] = useState('');

  const handleDownload = async () => {
    setLoading('loading');
    try {
      await downloadCallback(data, filename);
      setLoading('success');
    } catch (error) {
      setLoading('failed');
    }
  };

  return (
    <>
      {shouldRenderContent(data) && (
        <li>
          <ClickableText>
            <button
              className="flex items-center"
              onClick={handleDownload}
              disabled={loading !== ''}
              aria-label="download sermon"
            >
              {loading === 'loading' ? (
                LoadingSpinner()
              ) : loading === 'failed' ? (
                <>
                  <TbFaceIdError className="text-xl" />
                  <p className="no-underline pl-1">{displayText} Failed</p>
                </>
              ) : (
                <>
                  {React.cloneElement(icon, { className: 'text-xl' })}
                  <p className="pl-1">{displayText} </p>
                  {loading === 'success' && (
                    <FaCheck className="text-xl pl-2" />
                  )}
                </>
              )}
            </button>
          </ClickableText>
        </li>
      )}
    </>
  );
};

export const SermonDownload = ({ sermon }: SermonDownloadProps) => {
  // Check if any download options are available
  const media = getMedia(sermon);
  const hasDownloads =
    hasContent(media?.downloadUrl) ||
    hasContent(sermon.transcript) ||
    hasContent(media?.srtUrl) ||
    hasContent(media?.vttUrl);

  return (
    <div>
      {hasDownloads ? (
        <ul className="list-none space-y-2">
          {/* Download MP3 */}
          {sermon.mediaType === MediaType.Audio && media.downloadUrl && (
            <DownloadItem
              displayText={'Download as MP3'}
              downloadCallback={downloadMP3}
              data={media.downloadUrl}
              filename={'S' + sermon.id + '.mp3'}
              icon={<FaRegFileAudio />}
            />
          )}
          {/* Download MP4 */}
          {sermon.mediaType === MediaType.Video && media.downloadUrl && (
            <DownloadItem
              displayText={'Download as MP4'}
              downloadCallback={downloadMP4}
              data={media.downloadUrl}
              filename={'S' + sermon.id + '.mp4'}
              icon={<FaRegFileVideo />}
            />
          )}
          {/* Download PDF */}
          <DownloadItem
            displayText={'Download as PDF'}
            downloadCallback={downloadPDF}
            data={sermon}
            filename={'S' + sermon.id + '.pdf'}
            icon={<FaRegFilePdf />}
          />
          {/* Download TXT */}
          <DownloadItem
            displayText={'Download as TXT'}
            downloadCallback={downloadPlainText}
            data={sermon.transcript}
            filename={'S' + sermon.id + '.txt'}
            icon={<FaRegFileLines />}
          />
          {/* Download SRT */}
          {sermon.mediaType != MediaType.Text && media.srtUrl && (
            <DownloadItem
              displayText={'Download as SRT'}
              downloadCallback={downloadUrl}
              data={media.srtUrl}
              filename={'S' + sermon.id + '.srt'}
              icon={<FaRegClosedCaptioning />}
            />
          )}
          {/* Download VTT */}
          {sermon.mediaType != MediaType.Text && media.vttUrl && (
            <DownloadItem
              displayText={'Download as VTT'}
              downloadCallback={downloadUrl}
              data={media.vttUrl}
              filename={'S' + sermon.id + '.vtt'}
              icon={<FaRegClosedCaptioning />}
            />
          )}
        </ul>
      ) : (
        <p>
          This sermon is currently unavailable for download. We are working on
          making it available soon.
        </p>
      )}
    </div>
  );
};
