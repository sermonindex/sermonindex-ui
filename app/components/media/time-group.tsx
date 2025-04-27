import { Time, useMediaState } from '@vidstack/react';
import { isNumber } from '~/common/sanitize';
import { formatTime } from '~/common/format-number';

export interface TimeGroupProps {
  displayLength?: number;
}

export const TimeGroup = ({ displayLength }: TimeGroupProps) => {
  const canPlay = useMediaState('canPlay');
  const showPlaceholder = isNumber(displayLength) && !canPlay;

  return (
    <div className="flex text-xs justify-between">
      <Time className="time" type="current" />
      {showPlaceholder ? (
        <span className="text-xs">{formatTime(displayLength)}</span>
      ) : (
        <Time className="time" type="duration" />
      )}
    </div>
  );
};
