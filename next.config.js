const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  api: {
    bodyParser: {
      sizeLimit: "4mb"
    }
  }
};
module.exports = nextConfig;
