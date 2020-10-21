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
        br: `3px 3px ${defaultTheme.colors.gray[400]}`,
        b: `0px 3px ${defaultTheme.colors.gray[400]}`,
        'br-inset': `inset 3px 3px ${defaultTheme.colors.gray[400]}`,
        'b-inset': `inset 0px 3px ${defaultTheme.colors.gray[400]}`,
      },
    },
  },
  variants: {},
  plugins: [],
}
