import _ from "lodash";

import { images } from "assets/images";

const patterns = [
  images.pattern1,
  images.pattern2,
  images.pattern3,
  images.pattern4
];

const bigPatterns = [
  images.patternAndroid1,
  images.patternAndroid2,
  images.patternAndroid3,
  images.patternAndroid4
];

export function getRandomPatternIndex() {
  return _.random(0, patterns.length - 1);
}

export function getRandomPattern() {
  return patterns[_.random(0, patterns.length - 1)];
}

export function getPatternByIndex(index: number) {
  return patterns[index % patterns.length];
}

export function getBigPatternByIndex(index: number) {
  return bigPatterns[index % bigPatterns.length];
}

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
  mint: "#A5DAD2"
});

const backgroundColorsArray = _.values(backgroundColors);

export function getRandomBackgroundIndex() {
  return _.random(0, backgroundColorsArray.length - 1);
}

export function getBackgroundById(id: string | number) {
  const numberId = typeof id === "string" ? parseInt(id, 10) : id;

  return backgroundColorsArray[numberId % backgroundColorsArray.length];
}

export function getBackgroundByIndex(index: number) {
  return backgroundColorsArray[index % backgroundColorsArray.length];
}
