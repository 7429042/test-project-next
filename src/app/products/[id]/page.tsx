import ProductPageClient from './ProductPageClient';
import {notFound} from 'next/navigation';

// Для статического экспорта генерируем фиксированный список id (без сети)
export const dynamicParams = false;

export async function generateStaticParams() {
    return Array.from({length: 20}, (_, i) => ({id: String(i + 1)}));
}

interface PageProps {
    params: { id: string };
}

export default async function Page({params}: PageProps) {
    // Валидируем id: fakestoreapi использует положительные целые числа
    const idNum = Number(params.id);
    const isValid = Number.isInteger(idNum) && idNum > 0;
    if (!isValid) {
        notFound();
    }

    // (Опционально) Предзагрузка товара на билде для стабильного UI
    let initialProduct: any = undefined;
    try {
        const res = await fetch(`https://fakestoreapi.com/products/${idNum}`);
        initialProduct = res.ok ? await res.json() : undefined;
    } catch {
        // На билде внешняя сеть может быть недоступна — не падаем, рендерим без initialProduct
        initialProduct = undefined;
    }

    return <ProductPageClient id={idNum} initialProduct={initialProduct}/>;
}