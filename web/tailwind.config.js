const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    extend: {
      boxShadow: {
        kp: `3px 3px ${defaultTheme.colors.gray[500]}`,
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/ui')],
}
