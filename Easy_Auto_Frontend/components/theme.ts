// components/theme.ts
export const colors = {
  primary: "#235CF8",
  bgLight: "#d9ebfeff",
  blue: "#9bcbffff",
  white: "#FFFFFF",
  textGray: "#444444",
  darkblue: "#032960ff",
  textLight: "#9AA0A6",
  divider: "#E6E6E6",
};

export const typography = {
  heading: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#111827',
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#111827',
  },
  body: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    color: '#6B7280',
  }
};
