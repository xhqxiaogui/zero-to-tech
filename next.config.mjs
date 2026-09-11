/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出：next build 产出 out/ 纯静态目录，可直接交给 nginx 托管
  output: "export",
  // 静态导出下 Next 自带的图片优化服务不可用，必须关掉
  images: { unoptimized: true },
  // 每个路由生成 xxx/index.html，配合 nginx 目录索引最省事
  trailingSlash: true,
};

export default nextConfig;
