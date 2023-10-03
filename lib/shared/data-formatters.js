import { formatDistanceToNowStrict, parseISO } from "date-fns";

export const getTimeAgo = (timestamp) => {
  let timeAgo = "";

  if (timestamp) {
    const date = parseISO(timestamp);
    const timePeriod = formatDistanceToNowStrict(date);
    timeAgo = `${timePeriod} ago`;
  }

  return timeAgo;
};

export const parseValidInt = (value) => (parseInt(value) ? parseInt(value) : 0);

export const parseValidFloat = (value) =>
  parseFloat(value) ? parseFloat(value) : 0;

export const formatNumber = (number) => {
  return new Intl.NumberFormat().format(parseValidFloat(number).toFixed(2));
};

export const formatDate = (date) => {
  const options = {
    dateStyle: "medium",
    timeStyle: "short",
  };
  return new Date(date).toLocaleString("en-GB", options);
};

export const formatDateNoTime = (date) => {
  const options = {
    dateStyle: "medium",
  };
  return new Date(date).toLocaleString("en-GB", options);
};

export const getDateFilterFrom = (x_days) => {
  if (!x_days) {
    x_days = process?.env?.NEXT_PUBLIC_DAYS_AGO_FILTER ?? 1;
    x_days = parseValidInt(x_days);
  }

  const today = new Date();
  today.setDate(today.getDate() - x_days);
  return today.toISOString().split("T")[0];
};

export const deductDaysFromToday = (x_days) => {
  const today = new Date();
  today.setDate(today.getDate() - x_days);
  return today.toISOString().split("T")[0];
};

export const getDateFilterTo = (x_days) => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export const randomIntFromInterval = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};
