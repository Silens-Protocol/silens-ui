/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    eslint: {
      ignoreDuringBuilds: true,
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
  