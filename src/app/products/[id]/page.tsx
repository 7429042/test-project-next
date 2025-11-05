import ProductPageClient from './ProductPageClient';

export const dynamicParams = false;


export async function generateStaticParams() {
    const res = await fetch('https://fakestoreapi.com/products');
    const items = (await res.json()) as { id: number }[];
    return items.map((p) => ({ id: String(p.id) }));
}

export default function Page({ params }: { params: { id: string } }) {
    // Никаких сетевых вызовов на сервере
    return <ProductPageClient id={params.id} />;
}