/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-container-high": "#e7e8e9",
        "tertiary-container": "#673c11",
        "tertiary-fixed-dim": "#f9b984",
        "on-surface-variant": "#40484c",
        "tertiary-fixed": "#ffdcc1",
        "on-secondary-container": "#55656b",
        "inverse-surface": "#2e3132",
        "on-error-container": "#93000a",
        "surface-variant": "#e1e3e4",
        "surface-container": "#edeeef",
        "on-surface": "#191c1d",
        "surface-bright": "#f8f9fa",
        "on-primary-fixed-variant": "#014d61",
        "on-primary-fixed": "#001f29",
        "primary-container": "#004d61",
        "outline": "#70787c",
        "on-primary-container": "#83bdd4",
        "background": "#f8f9fa",
        "surface": "#f8f9fa",
        "on-tertiary-container": "#e5a874",
        "on-secondary-fixed-variant": "#39494f",
        "tertiary": "#4c2700",
        "on-primary": "#ffffff",
        "outline-variant": "#c0c8cc",
        "surface-container-low": "#f3f4f5",
        "secondary": "#516167",
        "error-container": "#ffdad6",
        "on-tertiary": "#ffffff",
        "surface-dim": "#d9dadb",
        "secondary-fixed": "#d4e5ec",
        "primary": "#003544",
        "secondary-fixed-dim": "#b8c9d0",
        "on-tertiary-fixed": "#2e1500",
        "primary-fixed": "#b9eaff",
        "on-secondary": "#ffffff",
        "secondary-container": "#d1e2e9",
        "surface-container-highest": "#e1e3e4",
        "error": "#ba1a1a",
        "surface-container-lowest": "#ffffff",
        "surface-tint": "#28657a",
        "on-secondary-fixed": "#0e1e23",
        "on-background": "#191c1d",
        "primary-fixed-dim": "#95cfe7",
        "on-tertiary-fixed-variant": "#683c11",
        "inverse-on-surface": "#f0f1f2",
        "on-error": "#ffffff",
        "inverse-primary": "#95cfe7"
      },
      fontFamily: {
        "headline": ["Manrope", "sans-serif"],
        "body": ["Newsreader", "serif"],
        "label": ["Manrope", "sans-serif"]
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem"
      }
    }
  },
  plugins: []
}
