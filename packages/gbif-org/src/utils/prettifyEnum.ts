export function prettifyEnum(text: string) {
  return typeof text === 'string'
    ? text.charAt(0) + text.slice(1).toLowerCase().replace(/_/g, ' ')
    : 'Unknown';
}
