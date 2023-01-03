module.exports = {
  reactStrictMode: true,
  experimental: {
    // this will allow nextjs to resolve files (js, ts, css)
    // outside packages/app directory.
    externalDir: true,
  },
  swcMinify: false,
};
