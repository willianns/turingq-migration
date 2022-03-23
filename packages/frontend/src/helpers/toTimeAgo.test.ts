/* eslint-disable max-len */
import toTimeAgo from './toTimeAgo';

test('should have dates as UTC', async () => {
  // Ensures we are running the tests in UTC to prevent timezone conversions.
  expect(new Date().getTimezoneOffset()).toBe(0);
});

test('should return "X seconds ago" below 45 seconds from the reference date', async () => {
  const mainDate = '2021-01-10T11:15:00.249+00:00';
  const refDate = '2021-01-10T11:15:44.249+00:00';
  const resultFromDateString = toTimeAgo(mainDate, refDate);
  const resultFromDateObject = toTimeAgo(new Date(mainDate), new Date(refDate));

  expect(resultFromDateString).toEqual('44 seconds ago');
  expect(resultFromDateObject).toEqual('44 seconds ago');
});

test('should return "about a minute ago" from 45 seconds to below 90 seconds from the reference date', async () => {
  const mainDate = '2021-01-10T11:15:00.249+00:00';
  const refDates = [
    '2021-01-10T11:15:45.249+00:00',
    '2021-01-10T11:16:29.249+00:00',
  ];

  refDates.forEach((refDate) => {
    const resultFromDateString = toTimeAgo(mainDate, refDate);
    const resultFromDateObject = toTimeAgo(
      new Date(mainDate),
      new Date(refDate)
    );

    expect(resultFromDateString).toEqual('about a minute ago');
    expect(resultFromDateObject).toEqual('about a minute ago');
  });
});

test('should return "X minutes ago" from 90 seconds to below 60 minutes from the reference date', async () => {
  const mainDate = '2021-01-10T11:15:00.249+00:00';
  const refTimes = [
    {
      time: '11:16:30',
      minutesElapsed: 2,
    },
    {
      time: '12:14:29',
      minutesElapsed: 59,
    },
  ];

  refTimes.forEach((refTime) => {
    const refDate = `2021-01-10T${refTime.time}.249+00:00`;
    const resultFromDateString = toTimeAgo(mainDate, refDate);
    const resultFromDateObject = toTimeAgo(
      new Date(mainDate),
      new Date(refDate)
    );

    expect(resultFromDateString).toEqual(
      `${refTime.minutesElapsed} minutes ago`
    );
    expect(resultFromDateObject).toEqual(
      `${refTime.minutesElapsed} minutes ago`
    );
  });
});

test('should return "Today at HH:MM" for more than 60 minutes within the same day from the reference date', async () => {
  const mainDate = '2021-01-10T11:15:00.249+00:00';
  const refTimes = ['12:15', '23:00'];

  refTimes.forEach((refTime) => {
    const refDate = `2021-01-10T${refTime}:00.249+00:00`;
    const resultFromDateString = toTimeAgo(mainDate, refDate);
    const resultFromDateObject = toTimeAgo(
      new Date(mainDate),
      new Date(refDate)
    );

    expect(resultFromDateString).toEqual('Today at 11:15');
    expect(resultFromDateObject).toEqual('Today at 11:15');
  });
});

test('should return "Yesterday at HH:MM" for more than 60 minutes if the reference date is in the next day', async () => {
  const mainDate = '2021-01-10T23:15:00.249+00:00';
  const refTimes = ['00:15', '23:59'];

  refTimes.forEach((refTime) => {
    const refDate = `2021-01-11T${refTime}:59.249+00:00`;
    const resultFromDateString = toTimeAgo(mainDate, refDate);
    const resultFromDateObject = toTimeAgo(
      new Date(mainDate),
      new Date(refDate)
    );

    expect(resultFromDateString).toEqual('Yesterday at 23:15');
    expect(resultFromDateObject).toEqual('Yesterday at 23:15');
  });
});

test('should return "Month XX at HH:MM" (without the year) for the same year', async () => {
  const mainDate = '2021-01-10T23:15:00.249+00:00';
  const refDates = [
    '2021-06-10T23:15:00.249+00:00',
    '2021-12-31T23:59:59.249+00:00',
  ];

  refDates.forEach((refDate) => {
    const resultFromDateString = toTimeAgo(mainDate, refDate);
    const resultFromDateObject = toTimeAgo(
      new Date(mainDate),
      new Date(refDate)
    );

    expect(resultFromDateString).toEqual('January 10 at 23:15');
    expect(resultFromDateObject).toEqual('January 10 at 23:15');
  });
});

test('should return "Month XX, YYYY at HH:MM" (with the year) if the year in the reference date is after the one in the original date', async () => {
  const mainDate = '2021-01-10T23:15:00.249+00:00';
  const refDates = [
    '2022-01-01T00:00:00.249+00:00',
    '2050-12-31T23:59:59.249+00:00',
  ];

  refDates.forEach((refDate) => {
    const resultFromDateString = toTimeAgo(mainDate, refDate);
    const resultFromDateObject = toTimeAgo(
      new Date(mainDate),
      new Date(refDate)
    );

    expect(resultFromDateString).toEqual('January 10, 2021 at 23:15');
    expect(resultFromDateObject).toEqual('January 10, 2021 at 23:15');
  });
});

test('should return "Month XX at HH:MM" (without the year) if the reference date is in the past, but in the same year', async () => {
  const mainDate = '2021-12-10T23:15:00.249+00:00';
  const refDates = [
    '2021-01-01T00:00:00.249+00:00',
    '2021-12-09T23:59:59.249+00:00',
  ];

  refDates.forEach((refDate) => {
    const resultFromDateString = toTimeAgo(mainDate, refDate);
    const resultFromDateObject = toTimeAgo(
      new Date(mainDate),
      new Date(refDate)
    );

    expect(resultFromDateString).toEqual('December 10 at 23:15');
    expect(resultFromDateObject).toEqual('December 10 at 23:15');
  });
});

test('should return "Month XX, YYYY at HH:MM" (with the year) if the reference date is in the past and not in the same year', async () => {
  const mainDate = '2021-01-10T23:15:00.249+00:00';
  const refDates = [
    '2020-01-01T00:00:00.249+00:00',
    '2000-12-31T23:59:59.249+00:00',
  ];

  refDates.forEach((refDate) => {
    const resultFromDateString = toTimeAgo(mainDate, refDate);
    const resultFromDateObject = toTimeAgo(
      new Date(mainDate),
      new Date(refDate)
    );

    expect(resultFromDateString).toEqual('January 10, 2021 at 23:15');
    expect(resultFromDateObject).toEqual('January 10, 2021 at 23:15');
  });
});
