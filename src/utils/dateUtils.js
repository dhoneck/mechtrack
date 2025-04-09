import dayjs from 'dayjs';

/** Formats a datetime string using dayjs. */
export const formatDateTime = (dateTime) => {
  return dayjs(dateTime).format('YYYY-MM-DD hh:mm a');
};