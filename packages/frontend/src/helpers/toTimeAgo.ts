/**
 * Formats a date into a string that indicates how long ago the date occurred.
 *
 * @param date The date to format.
 * @param referenceDate The reference date from which the calculation must be
 *        made. By default, it is the current date.
 * @returns The formatted date.
 */
const toTimeAgo = (
  date: Date | string,
  referenceDate: Date | string = new Date()
): string => {
  date = typeof date === 'string' ? new Date(date) : date;
  referenceDate =
    typeof referenceDate === 'string' ? new Date(referenceDate) : referenceDate;

  const milissecondsPerDay = 86400000; // 24 * 60 * 60 * 1000
  const numSeconds = Math.round(
    (referenceDate.getTime() - date.getTime()) / 1000
  );
  const numMinutes = Math.round(numSeconds / 60);

  let result;
  if (numSeconds > 0 && numSeconds < 45) {
    result = `${numSeconds} seconds ago`;
  } else if (numSeconds > 0 && numSeconds < 90) {
    result = 'about a minute ago';
  } else if (numMinutes > 0 && numMinutes < 60) {
    result = `${numMinutes} minutes ago`;
  } else {
    const yesterday = new Date(referenceDate.getTime() - milissecondsPerDay);

    const isToday = referenceDate.toDateString() === date.toDateString();
    const isYesterday = yesterday.toDateString() === date.toDateString();
    const isThisYear = referenceDate.getFullYear() === date.getFullYear();

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    if (isToday) {
      result = `Today at ${hours}:${minutes}`;
    } else if (isYesterday) {
      result = `Yesterday at ${hours}:${minutes}`;
    } else if (isThisYear) {
      result = `${month} ${day} at ${hours}:${minutes}`;
    } else {
      result = `${month} ${day}, ${year} at ${hours}:${minutes}`;
    }
  }

  return result;
};

export default toTimeAgo;
