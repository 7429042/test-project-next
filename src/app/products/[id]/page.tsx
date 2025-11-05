import ProductPageClient from './ProductPageClient';
import {notFound} from 'next/navigation';

// Для статического экспорта генерируем все допустимые id заранее
export const dynamicParams = false;

export async function generateStaticParams() {
    // Получаем список товаров на этапе билда
    const res = await fetch('https://fakestoreapi.com/products');
    if (!res.ok) return [];
    const items = (await res.json()) as { id: number }[];
    // Возвращаем id в виде строк, как ожидает роутер
    return items.map((p) => ({id: String(p.id)}));
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
    const res = await fetch(`https://fakestoreapi.com/products/${idNum}`);
    const initialProduct = res.ok ? await res.json() : undefined;

    return <ProductPageClient id={idNum} initialProduct={initialProduct}/>;
}