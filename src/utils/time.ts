export function formatTime(seconds: number) {
  const hour = Math.floor(seconds / 3600);

  const minute = Math.floor((seconds % 3600) / 60);

  const second = seconds % 60;

  return [
    hour,
    minute,
    second,
  ]
    .map((n) => n.toString().padStart(2, "0"))
    .join(":");
}