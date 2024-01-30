/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      sans: [
        "var(--fontFamily)"
      ],
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        paperBackground: "var(--paperBackground)",
        primary: {
          DEFAULT: 'rgb(var(--primary500) / <alpha-value>)',
          50: 'rgb(var(--primary50) / <alpha-value>)',
          100: 'rgb(var(--primary100) / <alpha-value>)',
          200: 'rgb(var(--primary200) / <alpha-value>)',
          300: 'rgb(var(--primary300) / <alpha-value>)',
          400: 'rgb(var(--primary400) / <alpha-value>)',
          500: 'rgb(var(--primary500) / <alpha-value>)',
          600: 'rgb(var(--primary600) / <alpha-value>)',
          700: 'rgb(var(--primary700) / <alpha-value>)',
          800: 'rgb(var(--primary800) / <alpha-value>)',
          900: 'rgb(var(--primary900) / <alpha-value>)',
          950: 'rgb(var(--primary950) / <alpha-value>)',
        },
        primaryContrast: {
          DEFAULT: 'rgb(var(--primaryContrast500) / <alpha-value>)',
          50: 'rgb(var(--primaryContrast50) / <alpha-value>)',
          100: 'rgb(var(--primaryContrast100) / <alpha-value>)',
          200: 'rgb(var(--primaryContrast200) / <alpha-value>)',
          300: 'rgb(var(--primaryContrast300) / <alpha-value>)',
          400: 'rgb(var(--primaryContrast400) / <alpha-value>)',
          500: 'rgb(var(--primaryContrast500) / <alpha-value>)',
          600: 'rgb(var(--primaryContrast600) / <alpha-value>)',
          700: 'rgb(var(--primaryContrast700) / <alpha-value>)',
          800: 'rgb(var(--primaryContrast800) / <alpha-value>)',
          900: 'rgb(var(--primaryContrast900) / <alpha-value>)',
          950: 'rgb(var(--primaryContrast950) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "calc(var(--borderRadiusPx) * 2)",
        md: "var(--borderRadiusPx)",
        sm: "calc(var(--borderRadiusPx) / 2)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '80ch', // add required value here
            'blockquote p:first-of-type::before': false, // do not add quotation marks to block quotes. we have block quotes where the content also have quotation marks leading to double quotation marks
            'blockquote p:first-of-type::after': false,
          }
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require("tailwindcss-animate")
  ],
}