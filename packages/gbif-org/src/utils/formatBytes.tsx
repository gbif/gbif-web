export function formatBytes(bytes: number, decimals: number) {
  if (bytes == 0) return { size: 0, unit: 'Bytes' };
  if (bytes == 1) return { size: 1, unit: 'Byte' };
  const k = 1000;
  const dm = decimals || 0;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return { size: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)), unit: sizes[i] };
}
