const nrwlConfig = require('@nrwl/react/plugins/webpack.js');

module.exports = (config, context) => {
  nrwlConfig(config);
  config.resolve.alias['fs'] = 'memfs';
  if (!config.resolve.fallback) config.resolve.fallback = {};
  config.resolve.fallback['process'] = require.resolve('process/browser');
  config.resolve.fallback['buffer'] = require.resolve('buffer/');
  config.resolve.fallback['assert'] = require.resolve('assert/');
  config.resolve.fallback['util'] = require.resolve('util/');
  config.resolve.fallback['stream'] = require.resolve('stream-browserify');
  config.resolve.fallback['path'] = require.resolve('path-browserify');
  console.log(config.resolve);
  return {
    ...config,
    plugins: [...config.plugins],
  };
};
