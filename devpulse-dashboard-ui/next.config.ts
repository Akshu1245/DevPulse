import type { NextConfig } from "next";

const backendUrl = (process.env.BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['*'],
  async rewrites() {
    // On Vercel, API routes are handled by the serverless function at /api
    // Don't rewrite them to an external backend
    if (isVercel && isProduction) {
      return [];
    }
    
    // In local dev, proxy API requests to the backend server
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/health',
        destination: `${backendUrl}/health`,
      },
      {
        source: '/openapi.json',
        destination: `${backendUrl}/openapi.json`,
      },
      {
        source: '/backend-docs',
        destination: `${backendUrl}/docs`,
      },
    ];
  },
};

export default nextConfig;
