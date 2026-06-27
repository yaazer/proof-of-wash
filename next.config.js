/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.88.249'],
  images: {
    remotePatterns: [],
  },
  env: {
    NEXT_PUBLIC_SQUARE_APP_ID: process.env.NEXT_PUBLIC_SQUARE_APP_ID,
    NEXT_PUBLIC_SQUARE_LOCATION_ID: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
    NEXT_PUBLIC_BTCPAY_URL: process.env.NEXT_PUBLIC_BTCPAY_URL,
  },
};

module.exports = nextConfig;
