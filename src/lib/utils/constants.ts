const OPENING_HOURS = [
  { day: "Sun - Mon", hours: ["closed"] },
  { day: "Tue - Thur", hours: ["6 pm - 9 pm"] },
  { day: "Fri - Sat", hours: ["12 pm - 10 pm"] },
];

const AU_STATES = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"] as const;
const AU_STATES_FULL = [
  "Australian Capital Territory",
  "New South Wales",
  "Northern Territory",
  "Queensland",
  "South Australia",
  "Tasmania",
  "Victoria",
  "Western Australia",
] as const;

const PAGES = [
  { href: "/", text: "Home" },
  { href: "/menu", text: "Menu" },
  { href: "/about", text: "About" },
  { href: "/contact", text: "Contact" },
];

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export { ACCEPTED_IMAGE_TYPES, AU_STATES, AU_STATES_FULL, MAX_FILE_SIZE, OPENING_HOURS, PAGES };
