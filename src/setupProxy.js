const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/influxdb-api',
    createProxyMiddleware({
      target: 'http://192.168.31.39:8086',  // Replace with your InfluxDB VM IP
      changeOrigin: true,
      pathRewrite: {
        '^/influxdb-api': '',
      },
    })
  );
};
