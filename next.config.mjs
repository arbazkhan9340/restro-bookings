/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Temporarily disable for deployment
  },
  images: {
    unoptimized: false, // Enable image optimization in production
    domains: ['localhost'], // Add your production domain later
  },
  compress: true, // Enable gzip compression
  swcMinify: true, // Use SWC for minification
  poweredByHeader: false, // Remove powered by header
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig
