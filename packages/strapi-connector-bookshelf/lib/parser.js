'use strict';

const { parse, isValid, parseISO } = require('date-fns');

const createParser = () => (type, value) => {
  if (value === null) return null;

  switch (type) {
    case 'json':
      return JSON.stringify(value);
    case 'time':
      return parseTime(value);
    case 'date':
      return parseDate(value);
    case 'timestamp':
    case 'datetime':
      return parseDateTimeOrTimestamp(value);
    default:
      return value;
  }
};

const parseDateOrThrow = format => value => {
  try {
    let date = parseISO(value);
    if (isValid(date)) return date;

    date = parse(value, format, new Date());

    if (isValid(date)) {
      return date;
    } else {
      throw new Error(`Invalid format, expected a ${format}`);
    }
  } catch (error) {
    throw new Error(`Invalid format, expected a ${format}`);
  }
};

const parseDateTimeOrTimestamp = value => {
  const date = parseISO(value);
  if (isValid(date)) return date;

  date.setTime(value);

  if (!isValid(date)) {
    throw new Error(`Invalid format, expected a timestamp or an ISO date`);
  }

  return date;
};

const parseTime = parseDateOrThrow('HH:mm:ss');
const parseDate = parseDateOrThrow('yyyy-MM-dd');

module.exports = { createParser };
