/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }, { protocol: "http", hostname: "**" }] },
  experimental: { serverActions: { allowedOrigins: ["*"] } },
  transpilePackages: ["sanitize-html", "htmlparser2", "dom-serializer", "domutils", "domhandler", "entities"],
};
export default nextConfig;
