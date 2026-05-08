export const formatHourMinute = (time: string) => {
  if (!time) return '';
  return time.slice(0, 5); // 07:00:00 -> 07:00
};
