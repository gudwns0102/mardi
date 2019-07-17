import _ from "lodash";
export const colors = Object.freeze({
  white: "#ffffff",
  black: "#000000",

  gray100: "#fafafa",
  gray200: "#f3f3f3",
  gray250: "#e6e6e6",
  gray300: "#b3b3b3",
  gray400: "#999999",
  gray450: "#888888",
  gray500: "#767676",
  gray600: "#444444",

  blue100: "#4646ff",
  blue200: "#006ff0",
  blue300: "#1956d4",

  red100: "#ff0a0a",
  red200: "#ff001f",
  red300: "rgb(255, 121, 133)",

  green100: "#17d9ca",

  mardiBlue: "#1956D4",
  vividPink: "#FF1051",
  alertRed: "#FF0A0A",
  mardiBlack: "#454545",
  darkGray: "#9B9B9B",
  lightGray: "#C8C8C8",
  rareMint: "#17D9CA",
  greyishBrown: "rgb(69, 69, 69)",
});

export const backgroundColors = Object.freeze({
  orange: "#FFAD00",
  sun: "#FFB362",
  peach: "#FF7854",
  pink: "#FF7985",
  red: "#CE1927",
  green: "#00998B",
  olive: "#113C2A",
  indigo: "#1E439A",
  paleblue: "#435894",
  sky: "#5987F2",
  purple: "#A178E1",
  khaki: "#CA9E93",
  brown: "#9F7B4B",
  mint: "#A5DAD2",
});

const backgroundColorsArray = _.values(backgroundColors);
const length = backgroundColorsArray.length;

export function getRandomBackgroundIndex() {
  return _.random(0, length - 1);
}

export function getBackgroundById(id: string | number) {
  const numberId = typeof id === "string" ? parseInt(id, 10) : id;

  return backgroundColorsArray[numberId % length];
}

export function getBackgroundByIndex(index: number) {
  return backgroundColorsArray[index % length];
}
