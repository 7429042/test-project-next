import ProductPageClient from './ProductPageClient';
import {notFound} from 'next/navigation';

export const dynamicParams = false;


export async function generateStaticParams() {
    const res = await fetch('https://fakestoreapi.com/products');
    const items = (await res.json()) as { id: number }[];
    return items.map((p) => ({ id: String(p.id) }));
}

export default async function Page({ params }: { params: { id: string } }) {
    const idNum = Number(params.id);
    const isValid = Number.isInteger(idNum) && idNum > 0;
    if (!isValid) {
        // Страница для нечисловых id не существует
        notFound();
    }

    // (Опционально) предзагрузим, чтобы UI был стабильнее на GH Pages
    const res = await fetch(`https://fakestoreapi.com/products/${idNum}`);
    const initialProduct = res.ok ? await res.json() : undefined;
    return <ProductPageClient id={idNum} initialProduct={initialProduct} />;
}