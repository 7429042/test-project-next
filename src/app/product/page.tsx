'use client';
import {Suspense} from 'react';
import {useSearchParams} from 'next/navigation';
import ProductPageClient from '@/app/products/[id]/ProductPageClient';

function ProductPageByQuery() {
    const search = useSearchParams();
    const idParam = search.get('id');
    const id: string | number | undefined = idParam ?? undefined;

    if (!id) {
        return <div className="p-6">Товар не найден</div>;
    }
    return <ProductPageClient id={id as any}/>;
}

export default function Page() {
    return (
        <Suspense fallback={null}>
            <ProductPageByQuery/>
        </Suspense>
    );
}
