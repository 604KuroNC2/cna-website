/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Deny framing (clickjacking protection)
  { key: "X-Frame-Options", value: "DENY" },
  // Referrer policy — don't leak full URL to third parties
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Permissions policy — disable unused browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // HSTS — enforce HTTPS (production only; safe to include in dev too)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      // Fetch directives
      "default-src 'self'",
      // Scripts: Next.js requires unsafe-eval in dev for HMR; unsafe-inline for inline scripts
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com",
      // Styles: Tailwind/GSAP use inline styles extensively
      "style-src 'self' 'unsafe-inline'",
      // Images: product images from CNA WP, Pexels stock photos, placeholder service, blob for uploads
      "img-src 'self' data: blob: https://6dywl8dmjehpqrx0.public.blob.vercel-storage.com https://images.pexels.com https://placehold.co",
      // Fonts: Next.js self-hosts Google Fonts at build time
      "font-src 'self'",
      // Connections: same-origin API routes only
      "connect-src 'self' https://www.google.com",
      // Block all plugin content (Flash, Java applets)
      "object-src 'none'",
      // Block <base> tag hijacking
      "base-uri 'self'",
      // Block form submissions to external URLs
      "form-action 'self'",
      // Block framing from any origin
      "frame-src 'self' https://www.google.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "6dywl8dmjehpqrx0.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/file/:path*",
        destination: "https://6dywl8dmjehpqrx0.public.blob.vercel-storage.com/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        stream: false,
        zlib: false,
        crypto: false,
        buffer: false,
      };
    }
    return config;
  },
};

export default nextConfig;
