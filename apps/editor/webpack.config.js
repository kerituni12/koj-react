/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

/* eslint-env node */

const path = require('path');
const webpack = require('webpack');
const { bundler, styles } = require('@ckeditor/ckeditor5-dev-utils');
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const nrwlConfig = require('@nrwl/react/plugins/webpack.js'); // require the main @nrwl/react/plugins/webpack configuration function.

module.exports = (config, context) => {
  nrwlConfig(config);
  return {
    ...config,

    optimization: {
      minimizer: [
        new TerserPlugin({
          sourceMap: true,
          terserOptions: {
            output: {
              // Preserve CKEditor 5 license comments.
              comments: /^!/,
            },
          },
          extractComments: false,
        }),
      ],
    },

    plugins: [
      new CKEditorWebpackPlugin({
        // UI language. Language codes follow the https://en.wikipedia.org/wiki/ISO_639-1 format.
        // When changing the built-in language, remember to also change it in the editor's configuration (src/ckeditor.js).
        language: 'en',
        additionalLanguages: 'all',
      }),
      new webpack.BannerPlugin({
        banner: bundler.getLicenseBanner(),
        raw: true,
      }),
    ],

    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            { loader: 'babel-loader' },
            {
              loader: '@linaria/webpack-loader',
              options: {
                sourceMap: process.env.NODE_ENV !== 'production',
              },
            },
          ],
        },
        {
          oneOf: [
            {
              test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
              use: ['raw-loader'],
            },
            {
              test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
              use: [
                {
                  loader: 'style-loader',
                  options: {
                    injectType: 'singletonStyleTag',
                    attributes: {
                      'data-cke': true,
                    },
                  },
                },
                {
                  loader: 'postcss-loader',
                  options: styles.getPostCssConfig({
                    themeImporter: {
                      themePath: require.resolve(
                        '@ckeditor/ckeditor5-theme-lark'
                      ),
                    },
                    minify: true,
                  }),
                },
              ],
            },
            {
              test: /\.css$/,
              exclude: [
                /\.module\.css$/,
                /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css/,
              ],
            },
            {
              test: /\.module\.css$/,
              exclude: [/ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css/],
            },
          ],
        },
      ],
    },
  };
};
