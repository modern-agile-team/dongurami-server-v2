export function TransformStringToBoolean({ value }) {
  return value === 'true' || value === '1'
    ? true
    : value === 'false' || value === '0'
      ? false
      : value;
}
