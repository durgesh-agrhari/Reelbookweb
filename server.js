const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();

// Proxy reel routes to API server
app.use('/reel/:id', createProxyMiddleware({
  target: 'https://reelbookapi.site',
  changeOrigin: true,
  pathRewrite: {
    '^/reel': '/reel/reel', // /reel/123 -> /reel/reel/123
  },
  onProxyReq: (proxyReq, req, res) => {
    // Set headers to ensure HTML response
    proxyReq.setHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error occurred');
  }
}));

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
