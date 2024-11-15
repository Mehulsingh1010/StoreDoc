'use client';

import { useState, useEffect } from "react";

const FormattedDateTime = ({
  date,
  className = ""
}: {
  date: string;
  className?: string;
}) => {
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    try {
      const dateObj = new Date(date);
      
      if (isNaN(dateObj.getTime())) {
        setFormattedDate("Invalid date");
        return;
      }

      // Get user's locale with fallback
      const userLocale = navigator.language || 'en';

      // Create relative time formatter for recent dates
      const rtf = new Intl.RelativeTimeFormat(userLocale, { numeric: 'auto' });
      
      // Calculate time difference in milliseconds
      const timeDiff = dateObj.getTime() - new Date().getTime();
      const daysDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24));
      const hoursDiff = Math.round(timeDiff / (1000 * 60 * 60));
      const minutesDiff = Math.round(timeDiff / (1000 * 60));

      // Format based on how recent the date is
      if (Math.abs(minutesDiff) < 60) {
        // Less than an hour ago
        setFormattedDate(rtf.format(minutesDiff, 'minute'));
      } else if (Math.abs(hoursDiff) < 24) {
        // Less than a day ago
        setFormattedDate(rtf.format(hoursDiff, 'hour'));
      } else if (Math.abs(daysDiff) < 7) {
        // Less than a week ago
        setFormattedDate(rtf.format(daysDiff, 'day'));
      } else {
        // More than a week ago
        const dateFormatter = new Intl.DateTimeFormat(userLocale, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        setFormattedDate(dateFormatter.format(dateObj));
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      setFormattedDate("Invalid date");
    }
  }, [date]);

  // Initial SSR render will show a simplified date
  if (!formattedDate) {
    const initialDate = new Date(date);
    return (
      <time dateTime={date} className={className}>
        {initialDate.toLocaleDateString()}
      </time>
    );
  }

  return (
    <time dateTime={date} className={className}>
      {formattedDate}
    </time>
  );
};

export default FormattedDateTime;