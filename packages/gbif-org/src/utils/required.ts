export function required(value: string | undefined, message: string): string {
  // Thorw an error if the value is not a string or if it is an empty string
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(message);
  }

  return value;
}
