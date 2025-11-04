import ProductPageClient from './ProductPageClient';

export const dynamicParams = false; // неизвестные id → 404, что корректно для статики

export async function generateStaticParams() {
    // ВАЖНО: .env уже содержит завершающий слэш
    const base = process.env.NEXT_PUBLIC_API_URL ?? 'https://fakestoreapi.com/';
    const res = await fetch(`${base}products`, { cache: 'force-cache' });
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
    const products: Array<{ id: number | string }> = await res.json();
    return products.map((p) => ({ id: String(p.id) }));
}

export default function Page({ params }: { params: { id: string } }) {
    return <ProductPageClient id={params.id} />;
}