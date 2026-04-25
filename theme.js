// src/theme.js — central design tokens for the playful TrendWatch UI

export const colors = {
  bg: '#F5F4F0',
  surface: '#FFFFFF',
  border: '#ECEAE3',
  borderStrong: '#CCCABC',
  text: '#111111',
  textSecondary: '#666666',
  textTertiary: '#AAAAAA',

  dark: '#111111',
  darkCard: '#1A1A2E',

  green: '#4ADE80',
  greenBg: '#F0FFF5',
  greenText: '#157A3C',
  greenBorder: '#A3E4BC',

  red: '#FF4444',
  redBg: '#FFF0F0',
  redText: '#CC2222',
  redBorder: '#FFCCCC',

  yellow: '#F5F073',

  // Category colors
  cat: {
    Politics:     { bg: '#EEF0FF', text: '#3730A3', border: '#C7D2FE' },
    Tech:         { bg: '#E6FDF5', text: '#065F46', border: '#6EE7B7' },
    Economy:      { bg: '#FFF7E0', text: '#92620A', border: '#FCD34D' },
    Society:      { bg: '#FFF0F5', text: '#9D1749', border: '#FBCFE8' },
    Sports:       { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' },
    Entertainment:{ bg: '#FDF4FF', text: '#7E22CE', border: '#E9D5FF' },
    Health:       { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
  },

  // Avatar palette (randomly assigned per session)
  avatars: [
    { bg: '#EEF0FF', text: '#3730A3' },
    { bg: '#FFF7E0', text: '#92620A' },
    { bg: '#F0FFF5', text: '#157A3C' },
    { bg: '#FFF0F5', text: '#9D1749' },
    { bg: '#EFF6FF', text: '#1E40AF' },
    { bg: '#FDF4FF', text: '#7E22CE' },
  ],
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 100,
};

export const font = {
  bold: '700',
  semibold: '600',
  medium: '500',
  regular: '400',
};
