/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Supabase görselleri için izin
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Kullanıyorsanız Unsplash izni
      }
    ],
    formats: ['image/avif', 'image/webp'], // Otomatik çevrilecek formatlar
  },
};

module.exports = nextConfig;