import { RiDownloadCloud2Line } from 'react-icons/ri';
import { Link } from '@remix-run/react';

export function DownloadButton({
  url,
  fileName,
}: {
  url: string;
  fileName?: string;
}) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName || 'audio.mp3'); // Set default filename if not provided
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pt-2">
      <Link to={url} download target="_blank">
        <button
          type={'button'}
          // onClick={handleDownload}
          className="text-si-slate hover:text-si-accent text-xl"
        >
          <RiDownloadCloud2Line />
        </button>
      </Link>
    </div>
  );
}
