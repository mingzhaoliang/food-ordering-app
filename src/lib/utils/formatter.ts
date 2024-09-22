const stateConversion = (state: string) => {
  const states: { [key: string]: string } = {
    ACT: "Australian Capital Territory",
    NSW: "New South Wales",
    NT: "Northern Territory",
    QLD: "Queensland",
    SA: "South Australia",
    TAS: "Tasmania",
    VIC: "Victoria",
    WA: "Western Australia",
  };

  return states[state];
};

const reversedStateConversion = (state: string) => {
  const states: { [key: string]: string } = {
    "Australian Capital Territory": "ACT",
    "New South Wales": "NSW",
    "Northern Territory": "NT",
    Queensland: "QLD",
    "South Australia": "SA",
    Tasmania: "TAS",
    Victoria: "VIC",
    "Western Australia": "WA",
  };

  return states[state];
};

const shortPriceFormatter = (number: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
  }).format(number);

const priceFormatter = (number: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(number);

const timerFormatter = (duration: number) => {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor(duration / (1000 * 60 * 60));

  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedHours = hours === 0 ? "" : hours < 10 ? `0${hours}:` : `${hours}:`;
  const formattedDuration = `${formattedHours}${formattedMinutes}:${formattedSeconds}`;

  return formattedDuration;
};

export const datetimeFormatter = (date: Date) =>
  new Intl.DateTimeFormat("en-AU", { dateStyle: "medium", timeStyle: "short" }).format(date);

export { priceFormatter, reversedStateConversion, shortPriceFormatter, stateConversion, timerFormatter };
