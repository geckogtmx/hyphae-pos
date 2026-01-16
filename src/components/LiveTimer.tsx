import React from 'react';

interface LiveTimerProps {
  startTime?: number;
  className?: string;
}

const LiveTimer: React.FC<LiveTimerProps> = ({ startTime, className }) => {
  if (!startTime) return <span className={className}>--:--</span>;
  
  // Format as static time (e.g. 12:45 PM)
  const timeString = new Date(startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <span className={className}>
      {timeString}
    </span>
  );
};

export default React.memo(LiveTimer);