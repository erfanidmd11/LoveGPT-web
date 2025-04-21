/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Tell Next.js to scan inside src/
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],

  eslint: {
    ignoreDuringBuilds: true,
  },

  async redirects() {
    return [
      {
        source: '/login',
        destination: '/',
        permanent: false,
      },
    ];
  },

  webpack(config, { dev }) {
    if (dev) {
      console.log('🛠️ Development mode: Webpack customization loaded');
    }

    return config;
  },
};

module.exports = nextConfig;

