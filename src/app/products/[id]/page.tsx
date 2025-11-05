import ProductPageClient from './ProductPageClient';

export const dynamicParams = false;

export async function generateStaticParams() {
    const base = process.env.NEXT_PUBLIC_API_URL ?? 'https://fakestoreapi.com/';
    try {
        const res = await fetch(`${base}products`, { cache: 'force-cache' });
        if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
        const products: Array<{ id: number | string }> = await res.json();
        return products.map((p) => ({ id: String(p.id) }));
    } catch {
        const fallbackIds = Array.from({ length: 20 }, (_, i) => String(i + 1));
        return fallbackIds.map((id) => ({ id }));
    }
}

async function fetchProduct(id: string) {
    const base = process.env.NEXT_PUBLIC_API_URL ?? 'https://fakestoreapi.com/';
    try {
        const res = await fetch(`${base}products/${id}`, { cache: 'force-cache' });
        if (!res.ok) return undefined;
        return res.json();
    } catch {
        return undefined;
    }
}

export default async function Page({ params }: { params: { id: string } }) {
    const initialProduct = await fetchProduct(params.id);
    // Даже если initialProduct не получен, клиентский компонент продолжит брать данные через RTK Query
    return <ProductPageClient id={params.id} initialProduct={initialProduct} />;
}