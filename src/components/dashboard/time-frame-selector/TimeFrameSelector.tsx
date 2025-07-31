import { useState } from 'react';
import classes from './TimeFrameSelector.module.scss';

export type TimeFrame = 'day' | 'week' | 'month' | 'year' | 'all';

export const TimeFrameSelector = ({ onSelect }: { onSelect: (timeFrame: TimeFrame) => void }) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('all');

  return (
    <div className={classes.timeFrameSelectorAlignerDiv}>
      <select
        className={classes.timeFrameDropdown}
        value={timeFrame}
        onChange={(e) => {
          setTimeFrame(e.target.value as TimeFrame);
          onSelect(e.target.value as TimeFrame);
        }}
      >
        <option value='day'>Day</option>
        <option value='week'>Week</option>
        <option value='month'>Month</option>
        <option value='year'>Year</option>
        <option value='all'>All Time</option>
      </select>
    </div>
  );
};
