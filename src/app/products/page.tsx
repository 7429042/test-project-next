'use client';
import {useGetProductsQuery} from '@/shared/api/baseApi';
import {IProduct} from '@/entities/product/model';
import ProductCard from '@/entities/product/ui/ProductCard/ProductCard';
import {useSelector} from 'react-redux';
import {selectDeletedIds, selectFavoriteIds} from '@/entities/product/model/productUiSlice';
import {useState} from 'react';
import {Button, Switch} from '@heroui/react';

type Filter = 'all' | 'favorite'

function Page() {
    const {isLoading, data, error} = useGetProductsQuery();
    const deletedIds = useSelector(selectDeletedIds);
    const favoriteIds = useSelector(selectFavoriteIds);
    const [filter, setFilter] = useState<Filter>('all');

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {String(error)}</div>;
    }

    const all = (data ?? []).filter((product: IProduct) => !deletedIds[product.id]);

    const visible = filter === 'all' ? all : all.filter((product: IProduct) => Boolean(favoriteIds[product.id]));
    const isFavFilter = filter === 'favorite';
    const isEmpty = visible.length === 0;

    return (
        <div className="flex flex-col p-6">
            {!(isFavFilter && isEmpty) && (
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Products</h1>
                    <Switch
                        color="success"
                        size="lg"
                        isSelected={isFavFilter}
                        onValueChange={(val) => setFilter(val ? 'favorite' : 'all')}
                        aria-label="Показывать только избранное"
                    >
                        Только избранное
                    </Switch>
                </div>
            )}
            {isFavFilter && isEmpty ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
                    <div className="text-5xl">🤍</div>
                    <h2 className="text-xl font-semibold">Избранное пусто</h2>
                    <p className="text-default-500 max-w-md">
                        Отметьте товары сердечком, чтобы они появились в этом списке.
                    </p>
                    <Button
                        className="mt-2"
                        color="primary"
                        variant="flat"
                        onPress={() => setFilter('all')}
                    >
                        Показать все товары
                    </Button>
                </div>
            ) : (
                <div className="w-full max-w-screen-xl mx-auto">
                    {isFavFilter ? (
                        <div className="flex flex-wrap gap-4 justify-center">
                            {visible.map((product: IProduct) => (
                                <div
                                    key={product.id}
                                    className="h-full w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                                >
                                    <ProductCard
                                        actions
                                        product={product}
                                        href={product.id.toString()}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
                            {visible.map((product: IProduct) => (
                                <div key={product.id} className="h-full">
                                    <ProductCard
                                        actions
                                        product={product}
                                        href={product.id.toString()}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>

    );
}

export default Page;