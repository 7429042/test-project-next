import ProductPageClient from './ProductPageClient';

export const dynamicParams = false;


export async function generateStaticParams() {
    // Либо фиксированный набор, либо попытка запроса с фолбэком — оставим как есть
    const fallbackIds = Array.from({ length: 20 }, (_, i) => String(i + 1));
    return fallbackIds.map((id) => ({ id }));
}

export default function Page({ params }: { params: { id: string } }) {
    // Никаких сетевых вызовов на сервере
    return <ProductPageClient id={params.id} />;
}