export const CLASS_COLORS = [
  { id: 0, name: 'Green', hex: '#10b981' },
  { id: 1, name: 'Purple', hex: '#8b5cf6' },
  { id: 2, name: 'Red', hex: '#ef4444' },
  { id: 3, name: 'Cyan', hex: '#06b6d4' },
  { id: 4, name: 'Yellow', hex: '#eab308' },
  { id: 5, name: 'Blue', hex: '#3b82f6' },
  { id: 6, name: 'Pink', hex: '#ec4899' },
  { id: 7, name: 'Indigo', hex: '#6366f1' },
];

export const getClassColor = (colorId: number) => {
  return CLASS_COLORS[colorId] || CLASS_COLORS[0];
};

export const getRandomColorId = (className: string) => {
  const hash = className.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return Math.abs(hash) % CLASS_COLORS.length;
};

export const hexToRgba = (hex: string, alpha: number = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
