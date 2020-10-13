const path = require('path')

module.exports = {
  presets: ['@redwoodjs/core/config/babel-preset'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        alias: {
          common: path.join(path.resolve('../'), 'common'),
        },
      },
    ],
  ],
}
