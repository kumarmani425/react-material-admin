import React, { useState, useEffect } from 'react';

function LiveClock() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Set up an interval to update the time every second
    const timerId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(timerId);
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount

  // Format the date and time string to include date, time, and seconds
  const formattedDateTime = currentDateTime.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: '2-digit', // This option ensures seconds are displayed
    hour12: true, // Use 12-hour format (AM/PM)
  });

  return (
    <div className="live-clock">
      <h4>{formattedDateTime}</h4>
    </div>
  );
}

export default LiveClock;
