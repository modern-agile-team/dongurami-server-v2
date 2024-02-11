export function TransformStringToBoolean({ value }) {
  return value === 'true' ? true : value === 'false' ? false : value;
}
