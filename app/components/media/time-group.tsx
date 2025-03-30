import { Time } from '@vidstack/react';

export function TimeGroup() {
  return (
    <div className="flex text-xs justify-between">
      <Time className="time" type="current" />
      <Time className="time" type="duration" />
    </div>
  );
}
