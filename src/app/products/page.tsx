'use client';
import {useGetProductsQuery} from '@/shared/api/baseApi';
import {IProduct} from '@/entities/product/model';
import ProductCard from '@/entities/product/ui/ProductCard/ProductCard';
import {Avatar, Badge} from '@heroui/react';

function Page() {
    const {isLoading, data, error} = useGetProductsQuery();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {String(error)}</div>;
    }

    return (
        <div className="p-3">
            <h1 className="text-2xl font-bold mb-4">Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data?.map((product: IProduct) => (

                    <ProductCard product={product} key={product.id}/>

                ))}
            </div>

        </div>
    );
}

export default Page;