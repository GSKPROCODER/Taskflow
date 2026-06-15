export function formatDate(
  date: string
) {
  return new Date(date)
    .toLocaleDateString();
}

export function truncateText(
  text: string,
  length = 100
) {
  if (text.length <= length)
    return text;

  return (
    text.substring(0, length) +
    "..."
  );
}

export function capitalize(
  value: string
) {
  return (
    value.charAt(0)
      .toUpperCase() +
    value.slice(1)
  );
}