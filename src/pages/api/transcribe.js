import httpProxy from 'http-proxy';

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

export default (req, res) =>
  new Promise((resolve, reject) => {
    const proxy = httpProxy.createProxy({
      ignorePath: true,
      changeOrigin: true,
      target: 'https://api.openai.com/v1/audio/transcriptions',
      header: { Authorization: `Bearer ${process.env.OPEN_AI_KEY}` },
    });
    proxy.on('proxyReq', function (proxyReq) {
      proxyReq.setHeader('Authorization', `Bearer ${process.env.OPEN_AI_KEY}`);
    });
    proxy.once('proxyRes', resolve).once('error', reject).web(req, res);
  });
