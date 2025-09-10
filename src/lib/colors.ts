export const CLASS_COLORS = [
  { id: 0, name: 'Red', hex: '#FF4646' },
  { id: 1, name: 'Green', hex: '#4CAF50' },
  { id: 2, name: 'Blue', hex: '#5463FF' },
  { id: 3, name: 'Orange', hex: '#FFC200' },
  { id: 4, name: 'Purple', hex: '#9C27B0' },
  { id: 5, name: 'Lime', hex: '#CDDC39' },
  { id: 6, name: 'Cyan', hex: '#00BCD4' },
  { id: 7, name: 'Black', hex: '#000000' },
  { id: 8, name: 'Indigo', hex: '#3F51B5' },
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
