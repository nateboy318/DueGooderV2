export function detectToolIntent(message: string) {
  const timeblockKeywords = [
    "block off",
    "schedule",
    "timeblock",
    "meeting",
    "lunch",
    "appointment",
    "study session",
    "reserve time",
    "calendar"
  ];
  const lower = message.toLowerCase();
  const isTimeblockIntent = timeblockKeywords.some(keyword => lower.includes(keyword));
  return {
    isTimeblockIntent
  };
}
