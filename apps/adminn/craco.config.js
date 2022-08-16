const path = require('path');
const { whenProd } = require('@craco/craco');
const CracoLessPlugin = require('craco-less');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = {
  webpack: {
    configure: (config) => {
      // Remove guard against importing modules outside of \`src\`.
      // Needed for workspace projects.
      config.plugins.map((plugin) => {
        whenProd(() => {
          if (plugin instanceof MiniCssExtractPlugin) {
            Object.assign(plugin.runtimeOptions, {
              insert: function (linkTag) {
                const regex = /.*\/*theme.*\..*\.*.*\.*css$/;
                if (regex.test(linkTag.href)) {
                  linkTag.setAttribute('id', 'theme');
                }
                document.head.appendChild(linkTag);
              },
            });
          }
        });
        return plugin;
      });

      config.resolve.plugins = config.resolve.plugins.filter(
        (plugin) => !(plugin instanceof ModuleScopePlugin)
      );

      // Add support for importing workspace projects.
      console.log(path.resolve(__dirname, 'tsconfig.json'));
      config.resolve.plugins.push(
        new TsConfigPathsPlugin({
          configFile: path.resolve(__dirname, 'tsconfig.json'),
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
          mainFields: ['module', 'main'],
        })
      );

      // Replace include option for babel loader with exclude
      // so babel will handle workspace projects as well.
      config.module.rules[1].oneOf.forEach((r) => {
        if (r.loader && r.loader.indexOf('babel') !== -1) {
          r.exclude = /node_modules/;
          delete r.include;
        }
      });
      return config;
    },
  },
  jest: {
    configure: (config) => {
      config.resolver = '@nrwl/jest/plugins/resolver';
      return config;
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
