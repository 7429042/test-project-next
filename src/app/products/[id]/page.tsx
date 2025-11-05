import ProductPageClient from './ProductPageClient';

export const dynamicParams = false;

export async function generateStaticParams() {
    const base = process.env.NEXT_PUBLIC_API_URL ?? 'https://fakestoreapi.com/';
    try {
        const res = await fetch(`${base}products`, {cache: 'force-cache'});
        if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
        const products: Array<{ id: number | string }> = await res.json();
        return products.map((p) => ({id: String(p.id)}));
    } catch {
        // Фолбэк на случай сетевой ошибки в CI — генерим фиксированный набор страниц
        const fallbackIds = Array.from({length: 20}, (_, i) => String(i + 1));
        return fallbackIds.map((id) => ({id}));
    }
}

export default function Page({params}: { params: { id: string } }) {
    return <ProductPageClient id={params.id}/>;
}