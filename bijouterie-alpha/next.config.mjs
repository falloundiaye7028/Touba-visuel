/** @type {import('next').NextConfig} */
const isProd = process.env.GITHUB_ACTIONS === 'true';
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isProd ? '/Touba-visuel' : '',
  assetPrefix: isProd ? '/Touba-visuel/' : '',
};
export default nextConfig;
