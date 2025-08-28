import dayjs from "dayjs";

// Central date format configuration
const DATE_FORMATS = {
  FULL_DATETIME: "dddd, MMMM D, YYYY h:mm A",
  DATE_ONLY: "MMMM D, YYYY",
  SHORT_DATE: "MMM D, YYYY",
  TIME_ONLY: "h:mm A",
  ISO_DATE: "YYYY-MM-DD",
  DISPLAY_DATETIME: "DD/MM/YYYY HH:mm",
  DISPLAY_DATE: "DD/MM/YYYY",
} as const;

// Common date formatter with configurable format
const dateTimeFormatter = {
  // Format with specific format string - Example: "Monday, January 1, 2024 12:30 PM"
  format: (date: string | Date | null, format: string = DATE_FORMATS.FULL_DATETIME) => {
    if (!date) return "(No Date)";
    return dayjs(date).format(format);
  },
  
  // Full date and time display - Example: "Monday, January 1, 2024 12:30 PM"
  fullDateTime: (date: string | Date | null) => {
    if (!date) return "(No Date)";
    return dayjs(date).format(DATE_FORMATS.FULL_DATETIME);
  },
  
  // Date only without time - Example: "January 1, 2024"
  dateOnly: (date: string | Date | null) => {
    if (!date) return "(No Date)";
    return dayjs(date).format(DATE_FORMATS.DATE_ONLY);
  },
  
  // Concise date format - Example: "Jan 1, 2024"
  shortDate: (date: string | Date | null) => {
    if (!date) return "(No Date)";
    return dayjs(date).format(DATE_FORMATS.SHORT_DATE);
  },
  
  // Standard display format for tables and lists - Example: "01/01/2024"
  displayDate: (date: string | Date | null) => {
    if (!date) return "(No Date)";
    return dayjs(date).format(DATE_FORMATS.DISPLAY_DATE);
  },
  
  // Date and time in compact format - Example: "01/01/2024 12:30"
  displayDateTime: (date: string | Date | null) => {
    if (!date) return "(No Date)";
    return dayjs(date).format(DATE_FORMATS.DISPLAY_DATETIME);
  },
  
  // Time only - Example: "12:30 PM"
  timeOnly: (date: string | Date | null) => {
    if (!date) return "(No Time)";
    return dayjs(date).format(DATE_FORMATS.TIME_ONLY);
  },
  
  // ISO date format for APIs and data processing - Example: "2024-01-01"
  isoDate: (date: string | Date | null) => {
    if (!date) return "";
    return dayjs(date).format(DATE_FORMATS.ISO_DATE);
  },
  
  // Constants for external use
  formats: DATE_FORMATS,
};

// Specific wrapper function for table column dates - can be easily changed centrally
const formatTableColumnDate = (date: string | Date | null) => {
  return dateTimeFormatter.displayDate(date);
};

// Legacy function for backward compatibility
const dateFormat = (date: string) => {
  return dateTimeFormatter.fullDateTime(date);
};

export { dateTimeFormatter, DATE_FORMATS, formatTableColumnDate };
export default dateFormat;
