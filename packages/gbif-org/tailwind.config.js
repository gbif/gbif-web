/** @type {import('tailwindcss').Config} */
module.exports = {
  safelist: [
    // Used by StepperForm component
    ...Array(15)
      .fill()
      .map((_, i) => `2xl:g-min-h-[${2.75 * (i + 1)}rem]`),
  ],
  // important: '.gbif', // make sure that the tailwind classes are not overriden by other css frameworks. This has been disabled as profiling shows that it performs really bad. To the level that deeply nested SVGs cannot render
  corePlugins: {
    preflight: false, // We do not want the preflight reset to apply to all sites where these componetns are used. Instead the reset is applied in index.css as a class
  },
  prefix: 'g-', // prefix all classes with g- to avoid conflicts with other css frameworks
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx,jsx,js}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    fontFamily: {
      sans: ['var(--fontFamily)'],
    },
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        paperBackground: 'rgb(var(--paperBackground))',
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
        // generated via https://uicolors.app/create
        // 'slate': {
        //   '50': '#f4f3f1',
        //   '100': '#edebe7',
        //   '200': '#d9d5cf',
        //   '300': '#c1bbb0',
        //   '400': '#a79d90',
        //   '500': '#95887a',
        //   '600': '#887a6e',
        //   '700': '#72645c',
        //   '800': '#5e544e',
        //   '900': '#4d4541',
        //   '950': '#292421',
        // },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
      },
      borderRadius: {
        lg: 'calc(var(--borderRadiusPx) * 2)',
        md: 'var(--borderRadiusPx)',
        sm: 'calc(var(--borderRadiusPx) / 2)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '80ch', // add required value here
            'blockquote p:first-of-type::before': false, // do not add quotation marks to block quotes. we have block quotes where the content also have quotation marks leading to double quotation marks
            'blockquote p:first-of-type::after': false,
          },
        },
      },
      flexBasis: {
        content: 'content',
      },
      boxShadow: {
        blocker: '0 0 0 10000px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [addRtlSupport(require('@tailwindcss/typography')), require('tailwindcss-animate')],
};

function addRtlSupport(plugin) {
  function traverseAndModify(object, modifier) {
    return Object.entries(object).reduce((acc, [key, value]) => {
      // Apply the modifier to the current key-value pair
      let [newKey, newValue] = modifier(key, value);

      // If the value is an array, recursively modify each item
      if (Array.isArray(newValue)) {
        newValue = newValue.map((item) => traverseAndModify(item, modifier));
      }
      // If the value is a nested object, recursively modify it
      else if (newValue != null && typeof newValue === 'object') {
        newValue = traverseAndModify(newValue, modifier);
      }

      acc[newKey] = newValue;
      return acc;
    }, {});
  }

  function modifiedPlugin(...args) {
    const original = plugin(...args);

    const modifiedConfig = traverseAndModify(original.config, (key, value) => {
      if (key === 'paddingLeft') key = 'paddingInlineStart';
      else if (key === 'paddingRight') key = 'paddingInlineEnd';
      else if (key === 'borderLeftWidth') key = 'borderInlineStartWidth';
      else if (key === 'borderLeftColor') key = 'borderInlineStartColor';
      else if (key === 'textAlign' && value === 'left') value = 'start';

      if (key.includes('left') || key.includes('right')) {
        console.warn(
          `It looks like "${key}" is a left/right specific property that is not handled by "addRtlSupport" in tailwind.config.js. Please take a look at this`
        );
      }

      if (typeof value === 'string' && (value.includes('left') || value.includes('right'))) {
        console.warn(
          `It looks like "${value}" with the key of "${key}" is a left/right specific value that is not handled by "addRtlSupport" in tailwind.config.js. Please take a look at this`
        );
      }

      return [key, value];
    });

    // Uncomment the following lines to debug the transformation
    // const fs = require('fs');
    // fs.writeFileSync('tailwind.before.log', JSON.stringify(original.config, null, 2))
    // fs.writeFileSync('tailwind.after.log', JSON.stringify(modifiedConfig, null, 2))

    original.config = modifiedConfig;
    return original;
  }

  // There are some properties on the plugin function that we need to copy over
  Object.entries(plugin).forEach(([key, value]) => {
    modifiedPlugin[key] = value;
  });

  return modifiedPlugin;
}
