'use client';
import {IProduct} from '@/entities/product/model';
import {useDispatch} from 'react-redux';
import {useRouter} from 'next/navigation';
import {upsertProduct} from '@/entities/product/model/productLocalSlice';
import {AppDispatch} from '@/processes/app/store';
import ProductForm, {ProductFormValues} from '@/entities/product/ui/ProductForm/ProductForm';
import {Card, CardBody, CardHeader} from '@heroui/react';


export default function CreateProductPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const handleCreate = (values: ProductFormValues) => {
        // Отрицательный числовой id, чтобы не пересекаться с API (1..20)
        const newId = -Date.now();

        const product: IProduct = {id: newId, ...values};
        dispatch(upsertProduct(product));

        // Для локальных товаров используем универсальный маршрут,
        // который стабильно работает на GH Pages
        router.push(`/product/?id=${encodeURIComponent(String(product.id))}`);
    };

    return (
        <Card className="p-4 max-w-2xl mx-auto">
            <CardHeader>
                <h1 className="text-2xl font-bold">Добавить продукт</h1>
            </CardHeader>
            <CardBody>
                <ProductForm submitLabel="Создать" onSubmitAction={handleCreate} defaultValues={{
                    title: '',
                    price: 0,
                    description: '',
                    category: '',
                    image: ''
                }}/>
            </CardBody>
        </Card>
    );
}