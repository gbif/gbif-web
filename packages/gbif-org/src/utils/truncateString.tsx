// Utility to truncate the middle of a string
export function truncateMiddle(str: string, len: number) {
  if (!str) {
    return false;
  }
  const data = str.toString();
  if (data.length < len) {
    return data;
  }
  if (len < 20) {
    return data.slice(0, len - 3) + '...';
  }
  const splitLength = len / 2 - 3;
  return data.slice(0, splitLength) + '...' + data.slice(data.length - splitLength);
}
