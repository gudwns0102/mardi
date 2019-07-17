export function sleep(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export function formatDiffTime(ms: number): string {
  const diff = Date.now() - ms;
  const minutes = Math.floor(diff / (60 * 1000));
  const hours = Math.floor(diff / (3600 * 1000));
  const day = Math.floor(diff / (3600 * 1000 * 24));
  const week = Math.floor(diff / (3600 * 1000 * 24 * 7));

  if (diff < 0) {
    return "방금 전";
  }

  if (day >= 30) {
    return new Date(ms)
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "/");
  }

  return week
    ? week + "주"
    : day
    ? day + "일"
    : hours
    ? hours + "시간"
    : minutes
    ? minutes + "분"
    : "방금 전";
}
