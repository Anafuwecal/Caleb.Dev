const isProd = process.env.NODE_ENV === "production";
const repoName = process.env.GITHUB_REPOSITORY_NAME || "Cal.Dev";
 
const nextConfig = {
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}/` : "",
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};
 
module.exports = nextConfig;