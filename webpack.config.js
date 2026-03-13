const path = require('path');

/** @type {import('webpack').Configuration[]} */
module.exports = [
  // ESM build
  {
    mode: 'production',
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.mjs',
      library: {
        type: 'module',
      },
      module: true,
      clean: true,
    },
    experiments: {
      outputModule: true,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
      '@wordpress/api-fetch': '@wordpress/api-fetch',
      '@wordpress/components': '@wordpress/components',
      '@wordpress/element': '@wordpress/element',
      '@wordpress/i18n': '@wordpress/i18n',
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        },
      ],
    },
    optimization: {
      minimize: true,
    },
  },

  // CJS build
  {
    mode: 'production',
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
      library: {
        type: 'commonjs2',
      },
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
      '@wordpress/api-fetch': '@wordpress/api-fetch',
      '@wordpress/components': '@wordpress/components',
      '@wordpress/element': '@wordpress/element',
      '@wordpress/i18n': '@wordpress/i18n',
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        },
      ],
    },
    optimization: {
      minimize: true,
    },
  },
];