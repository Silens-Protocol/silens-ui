/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    eslint: {
      ignoreDuringBuilds: true,
    },
    images: {
      domains: [
        'gateway.pinata.cloud',
        'ipfs.io',
        'cloudflare-ipfs.com',
        'dweb.link'
      ],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'gateway.pinata.cloud',
          port: '',
          pathname: '/ipfs/**',
        },
        {
          protocol: 'https',
          hostname: 'ipfs.io',
          port: '',
          pathname: '/ipfs/**',
        },
        {
          protocol: 'https',
          hostname: 'cloudflare-ipfs.com',
          port: '',
          pathname: '/ipfs/**',
        },
        {
          protocol: 'https',
          hostname: 'dweb.link',
          port: '',
          pathname: '/ipfs/**',
        },
      ],
    },
    webpack(config, { isServer }) {
      config.module.rules.push({
        test: /HeartbeatWorker\.js$/,
        loader: 'ignore-loader',
      });
  
      return config;
    },
  };
  
  export default nextConfig;
  