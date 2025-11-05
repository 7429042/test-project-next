'use client';
import {useGetProductsQuery} from '@/shared/api/baseApi';
import {IProduct} from '@/entities/product/model';
import ProductCard from '@/entities/product/ui/ProductCard/ProductCard';
import {useSelector} from 'react-redux';
import {selectDeletedIds, selectFavoriteIds} from '@/entities/product/model/productUiSlice';
import {Suspense, useMemo, useState} from 'react';
import {Button, Pagination, Select, SelectItem, Skeleton, Switch} from '@heroui/react';
import ProductCardSkeleton from '@/entities/product/ui/ProductCard/ProductCardSkeleton';
import {selectAllLocal} from '@/entities/product/model/productLocalSlice';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';

type Filter = 'all' | 'favorite'

function ProductsContent() {
    const {isLoading, data, error} = useGetProductsQuery();
    const deletedIds = useSelector(selectDeletedIds);
    const favoriteIds = useSelector(selectFavoriteIds);
    const localProducts = useSelector(selectAllLocal);

    const pathName = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const q = (searchParams.get('q') ?? '').trim().toLowerCase();

    const [filter, setFilter] = useState<Filter>('all');
    const [pageSize, setPageSize] = useState(8);

    const pageFromUrl = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
    const setUrlPage = (nextPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(Math.max(1, nextPage)));
        // Важно: не использовать абсолютный путь без basePath; просто меняем строку запроса
        router.replace(`?${params.toString()}`);
    };
    const merged: IProduct[] = useMemo(() => {
        const api = (data ?? []) as IProduct[];
        const map = new Map<string, IProduct>();
        for (const p of localProducts) map.set(String(p.id), p);
        for (const p of api) {
            const key = String(p.id);
            if (!map.has(key)) map.set(key, p);
        }
        return Array.from(map.values());
    }, [data, localProducts]);

    const all = merged.filter((product) => !deletedIds[String(product.id)]);
    const filteredByFav = filter === 'all' ? all : all.filter((p) => Boolean(favoriteIds[String(p.id)]));

    const visible = useMemo(() => {
        if (!q) return filteredByFav;
        return filteredByFav.filter((p) => {
            const title = p.title?.toLowerCase() ?? '';
            const desc = p.description?.toLowerCase() ?? '';
            const cat = p.category?.toLowerCase() ?? '';
            return title.includes(q) || desc.includes(q) || cat.includes(q);
        });
    }, [filteredByFav, q]);

    const isFavFilter = filter === 'favorite';
    const isEmpty = visible.length === 0;
    const {totalPages, pageItems, safePage} = useMemo(() => {
        const totalPagesCalc = Math.max(1, Math.ceil(visible.length / pageSize));
        const safePageCalc = Math.min(pageFromUrl, totalPagesCalc);
        const start = (safePageCalc - 1) * pageSize;
        const end = start + pageSize;
        return {
            totalPages: totalPagesCalc,
            pageItems: visible.slice(start, end),
            safePage: safePageCalc,
        };
    }, [visible, pageSize, pageFromUrl]);

    if (isLoading) {
        return (
            <div className="flex flex-col p-6">
                <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-8 w-40 rounded-md"/>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-16 rounded-full"/>
                        <Skeleton className="h-5 w-28 rounded-md"/>
                    </div>
                </div>
                <div className="w-full max-w-screen-xl mx-auto">
                    <div className="flex flex-wrap gap-4 justify-center">
                        {Array.from({length: pageSize}).map((_, idx) => (
                            <div key={idx}
                                 className="h-full w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(25%-0.75rem)]">
                                <ProductCardSkeleton/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div>Error: {String(error)}</div>;
    }
    return (
        <div className="flex flex-col p-6">
            {!(isFavFilter && isEmpty) && (
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Products</h1>
                    <div className="flex items-center gap-3">
                        <Select
                            aria-label="Размер страницы"
                            size="sm"
                            selectedKeys={[String(pageSize)]}
                            className="w-28"
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setUrlPage(1);
                            }}
                        >
                            {[8, 12, 16, 24].map((n) => (
                                <SelectItem key={String(n)} textValue={`${n}`}>
                                    {n}/стр
                                </SelectItem>
                            ))}
                        </Select>
                        <Switch
                            color="success"
                            size="lg"
                            isSelected={isFavFilter}
                            onValueChange={(val) => {
                                setFilter(val ? 'favorite' : 'all');
                                setUrlPage(1);
                            }}
                            aria-label="Показывать только избранное"
                        >
                            Только избранное
                        </Switch>
                    </div>
                </div>
            )}

            {isFavFilter && isEmpty ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
                    <div className="text-5xl">🤍</div>
                    <h2 className="text-xl font-semibold">Избранное пусто</h2>
                    <p className="text-default-500 max-w-md">
                        Отметьте товары сердечком, чтобы они появились в этом списке.
                    </p>
                    <Button className="mt-2" color="primary" variant="flat" onPress={() => setFilter('all')}>
                        Показать все товары
                    </Button>
                </div>
            ) : (
                <div className="w-full max-w-screen-xl mx-auto">
                    <div
                        className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
                        {pageItems.map((product: IProduct) => {

                            const id = product.id as unknown as number | string;
                            // Для GitHub Pages используем универсальный клиентский роут
                            const href = `/product/?id=${encodeURIComponent(String(id))}`;

                            return (
                                <div key={String(product.id)} className="h-full">
                                    <ProductCard actions product={product} href={href}/>
                                </div>
                            );
                        })}
                    </div>
                    {visible.length > 0 && (
                        <div className="flex items-center justify-between mt-6">
                            <div
                                className="text-sm text-default-500">Показано {pageItems.length} из {visible.length}</div>
                            <Pagination isCompact showControls page={safePage} total={totalPages} onChange={setUrlPage}
                                        color="primary"/>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={null}>
            <ProductsContent/>
        </Suspense>
    );
}
