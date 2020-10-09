module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    extend: {
      boxShadow: {
        kp: '3px 3px #a0aec0',
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/ui')],
}
