/**
 * Centralized color configuration for the Easy Auto App.
 * Use these constants instead of hardcoded hex values to ensure consistency.
 */

export const COLORS = {
    // Primary Brand Colors
    primary: "#235CF8",      // Vibrant Blue (Header, Primary Buttons)
    primaryDark: "#1E4DB7",  // Slightly darker blue for pressed states
    primaryLight: "#EAF2FF", // Very light blue for backgrounds/badges
    primaryFaint: "#D9EBFE", // Even lighter blue (formerly bgLight)

    // Secondary / Accent Colors
    secondary: "#032960",    // Deep Navy Blue (formerly darkblue)
    accent: "#FF9800",       // Orange (Warnings, Highlights)

    // Neutral / Semantic Colors
    white: "#FFFFFF",
    black: "#000000",
    transparent: "transparent",

    // Backgrounds
    background: "#F9FAFB",      // Lightest gray for most screens
    backgroundSecondary: "#FFFFFF", // White cards/containers
    backgroundMuted: "#F3F4F6",    // Light gray for borders or secondary areas

    // Text Colors
    text: {
        primary: "#111827",    // Near black (Headings, titles)
        secondary: "#4B5563",  // Dark gray (Body text)
        gray: "#444444",       // Alternative gray (formerly textGray)
        muted: "#6B7280",      // Medium gray (Descriptions)
        placeholder: "#9CA3AF", // Light gray (Input placeholders)
        light: "#9AA0A6",      // Very light gray text
        white: "#FFFFFF",      // White text on dark backgrounds
        blue: "#235CF8",       // Primary blue text
    },

    // Action/Status Colors
    status: {
        success: "#10B981",    // Green (Active, Success)
        successLight: "#ECFDF5",
        danger: "#EF4444",     // Red (Paused, Delete, Error)
        dangerLight: "#FEF3F2",
        warning: "#F59E0B",    // Amber (Alerts)
        info: "#3B82F6",       // Info Blue
    },

    // Borders and Dividers
    border: "#E5E7EB",       // Standard light gray border
    borderDark: "#D1D5DB",   // Slightly darker border
    divider: "#F3F4F6",      // Light divider line
    dividerLegacy: "#E6E6E6", // Standard divider from theme.ts

    // Input Colors
    inputBg: "#FFFFFF",
    inputBorder: "#E5E7EB",
    inputFocus: "#235CF8",

    // Specialty (Specific to components)
    shadow: "#000000",
    overlay: "rgba(0, 0, 0, 0.5)",

    // Brand specific blues from various places
    skyBlue: "#9BCBFF",      // From components/theme.ts
    legacyBlue: "#1E60FF",   // Old header blue (being phased out)
};

export default COLORS;
