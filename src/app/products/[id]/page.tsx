import ProductPageClient from './ProductPageClient';
import {notFound} from 'next/navigation';

// Для статического экспорта генерируем все допустимые id заранее
export const dynamicParams = false;


export async function generateStaticParams() {
    try {
        const res = await fetch('https://fakestoreapi.com/products', {
            // для build-time запроса неважно кэшировать; главное — не падать
            // в App Router на билде fetch и так кэшируется, но try/catch всё равно нужен
            // next: { revalidate: 0 }  // можно добавить, но не обязательно
        });
        if (res.ok) {
            const items = (await res.json()) as { id: number }[];
            if (Array.isArray(items) && items.length > 0) {
                return items.map((p) => ({id: String(p.id)}));
            }
        }
    } catch {
        // игнорируем сетевую ошибку и падаем на дефолт ниже
    }
    // Фолбэк — стандартные id fakestoreapi
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