'use client';
import {useSearchParams} from 'next/navigation';
import ProductPageClient from '@/app/products/[id]/ProductPageClient';

export default function Page() {
    const search = useSearchParams();
    const idParam = search.get('id');

    // Передаём как есть: компонент сам решит, нужно ли делать запрос (только для числовых id)
    const id: string | number | undefined = idParam ?? undefined;

    if (!id) {
        return (
            <div className="p-6">
                Товар не найден
            </div>
        );
    }

    return <ProductPageClient id={id as any}/>;
}
