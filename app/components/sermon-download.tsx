import React, { useState } from 'react';
import { Sermon } from '~/api/interfaces';
import { ClickableText } from '~/common/section';
import {
  downloadMP3,
  downloadMP4,
  downloadPDF,
  downloadPlainText,
  downloadUrl,
} from '~/common/download';
import {
  FaCheck,
  FaRegClosedCaptioning,
  FaRegFileAudio,
  FaRegFileLines,
  FaRegFilePdf,
  FaRegFileVideo,
} from 'react-icons/fa6';
import { hasContent } from '~/common/sanitize';
import { TbFaceIdError } from 'react-icons/tb';

interface SermonDownloadProps {
  sermon: Sermon;
}

interface DownloadItemProps {
  displayText: string;
  downloadCallback: CallableFunction;
  data: string | undefined;
  filename: string;
  icon: React.ReactNode;
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
      {hasContent(data) && (
        <li>
          <ClickableText>
            <button
              className="flex items-center"
              onClick={handleDownload}
              disabled={loading !== ''}
            >
              {loading === 'loading' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-si-accent"></div>
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
  const hasDownloads =
    hasContent(sermon.audioUrl) ||
    hasContent(sermon.videoDownloadUrl) ||
    hasContent(sermon.transcript) ||
    hasContent(sermon.srtUrl) ||
    hasContent(sermon.vttUrl);

  return (
    <div>
      {hasDownloads ? (
        <ul className="p-4 list-none space-y-2">
          {/* Download MP3 */}
          <DownloadItem
            displayText={'Download as MP3'}
            downloadCallback={downloadMP3}
            data={sermon.audioUrl}
            filename={'S' + sermon.id + '.mp3'}
            icon={<FaRegFileAudio />}
          />
          {/* Download MP4 */}
          <DownloadItem
            displayText={'Download as MP4'}
            downloadCallback={downloadMP4}
            data={sermon.videoDownloadUrl}
            filename={'S' + sermon.id + '.mp4'}
            icon={<FaRegFileVideo />}
          />
          {/* Download PDF */}
          <DownloadItem
            displayText={'Download as PDF'}
            downloadCallback={downloadPDF}
            data={sermon.transcript}
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
          <DownloadItem
            displayText={'Download as SRT'}
            downloadCallback={downloadUrl}
            data={sermon.srtUrl}
            filename={'S' + sermon.id + '.srt'}
            icon={<FaRegClosedCaptioning />}
          />
          {/* Download VTT */}
          <DownloadItem
            displayText={'Download as VTT'}
            downloadCallback={downloadUrl}
            data={sermon.vttUrl}
            filename={'S' + sermon.id + '.vtt'}
            icon={<FaRegClosedCaptioning />}
          />
        </ul>
      ) : (
        <p className="p-4">
          This sermon is currently unavailable for download. We are working on
          making it available soon.
        </p>
      )}
    </div>
  );
};
