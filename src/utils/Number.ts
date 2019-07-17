export function shrinkValue(value: number) {
  if (value <= 0) {
    return value + "";
  }

  if (value < 1e4) {
    return value + "";
  }

  if (value < 1e6) {
    return (value / 1e3).toFixed(0) + " K";
  }

  return (value / 1e6).toFixed(0) + " M";
}

export function toMSS(value: number) {
  const roundSeconds = Math.round(value);
  const minute = Math.floor(roundSeconds / 60);
  const seconds = roundSeconds % 60;
  return `${minute}:${("00" + seconds).substr(-2, 2)}`;
}
