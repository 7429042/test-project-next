import ProductPageClient from './ProductPageClient';

export const dynamicParams = false; // неизвестные id → 404, что корректно для статики

export async function generateStaticParams() {
    const base = process.env.NEXT_PUBLIC_API_URL ?? 'https://fakestoreapi.com/';
    const res = await fetch(`${base}products`, { cache: 'force-cache' });
    console.log('[generateStaticParams] status:', res.status);
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
    const products: Array<{ id: number | string }> = await res.json();
    console.log('[generateStaticParams] total:', products?.length);
    const ids = products.map((p) => String(p.id));
    console.log('[generateStaticParams] ids:', ids);
    return ids.map((id) => ({ id }));
}

export default function Page({ params }: { params: { id: string } }) {
    return <ProductPageClient id={params.id} />;
}