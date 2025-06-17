import { MediaErrorDetail } from '@vidstack/react';

interface SiMediaErrorProps {
  detail: MediaErrorDetail;
}

export function SiMediaError({ detail }: SiMediaErrorProps) {
  return (
    <div className="flex h-full w-full items-center justify-center text-center">
      <p>
        An error occurred: {detail.message} (Code: {detail.code})
      </p>
    </div>
  );
}
