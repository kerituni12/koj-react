const { BASE_API_URL } = require('@/constants/default-value');
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/',
    createProxyMiddleware({
      target: BASE_API_URL,
      // changeOrigin: true,
      secure: false,
    })
  );
};
