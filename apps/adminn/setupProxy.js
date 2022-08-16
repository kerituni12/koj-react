const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/',
    createProxyMiddleware({
      target: 'https://sub.koj.test',
      // changeOrigin: true,
      secure: false,
    })
  );
};
