// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'http',
//         hostname: 'localhost',
//       },
//       {
//         protocol: 'https',
//         hostname: '*.supabase.co',
//       },
//     ],
//   },
//   experimental: {
//     serverComponentsExternalPackages: ['@supabase/supabase-js'],
//     esmExternals: 'loose'
//   },
// };

// export default nextConfig;







/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  // 移除 experimental 配置，使用新的配置方式
  serverExternalPackages: ['@supabase/supabase-js'],
};

export default nextConfig;