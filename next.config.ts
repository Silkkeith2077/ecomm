import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: '**' },
            { protocol: 'http', hostname: 'localhost', port: '8000' },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/media/:path*',
                destination: 'http://localhost:8000/media/:path*',
            },
        ]
    },
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
        NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws',
    },
    reactCompiler: true,
};

export default nextConfig;