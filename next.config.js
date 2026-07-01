/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fully static site — exported to ./out and served from GitHub Pages at the
  // domain root (jgianfelice.github.io). All Notion content is baked in at
  // build time; a scheduled Action rebuilds to pull fresh content.
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**.notion.so' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
    ],
  },
};
module.exports = nextConfig;
