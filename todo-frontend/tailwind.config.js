module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "surface-100": "#F7F7F8",
        "surface-200": "#E5E5E7",
        "surface-300": "#D2D2D6",
        "surface-800": "#1A1A1F",
        "surface-900": "#0F0F14",
        accent: "#7D89B0",
        "accent-hover": "#9AA3C0",
      },
      textColor: {
        "text-primary": "rgba(255,255,255,0.95)",
        "text-secondary": "rgba(255,255,255,0.75)",
        "text-muted": "rgba(255,255,255,0.55)",
        "text-faint": "rgba(255,255,255,0.35)",
      },
      borderColor: {
        "border-strong": "rgba(255,255,255,0.12)",
        "border-soft": "rgba(255,255,255,0.06)",
      },
    },
  },
  plugins: [],
};