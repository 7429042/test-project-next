import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production'
const repo = 'test-project-next' // имя репозитория


const nextConfig: NextConfig = {
    output: 'export',              // обязательный статический экспорт
    images: { unoptimized: true }, // отключаем серверную оптимизацию изображений
    // Так как это "project site" (адрес будет /test-project-next/...),
    // в проде нужны корректные базовые пути:
    basePath: isProd ? `/${repo}` : undefined,
    assetPrefix: isProd ? `/${repo}/` : undefined,
    // при желании можно включить слэш на конце урлов:
    // trailingSlash: true,
  /* config options here */
};

export default nextConfig;
