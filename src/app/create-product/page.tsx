'use client';
import {IProduct} from '@/entities/product/model';
import {v4 as uuidv4} from 'uuid';
import {useDispatch} from 'react-redux';
import {useRouter} from 'next/navigation';
import {upsertProduct} from '@/entities/product/model/productLocalSlice';
import {AppDispatch} from '@/processes/app/store';
import ProductForm, {ProductFormValues} from '@/entities/product/ui/ProductForm/ProductForm';

function CreateProductPage() {

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const defaults: ProductFormValues = {
        title: '',
        description: '',
        price: 0,
        category: '',
        image: '',
    };

    const handleCreate = (values: ProductFormValues) => {
        const product: IProduct = {id: uuidv4(), ...values};
        dispatch(upsertProduct(product));
        router.push(`/products/${product.id}`);
    };

    return (
        <div className="w-full mx-auto p-6 max-w-xl">
            <h1 className="text-2xl font-bold mb-4">Создать продукт</h1>
            <ProductForm defaultValues={defaults} onSubmitAction={handleCreate} submitLabel="Создать продукт"/>
        </div>
    );
}

export default CreateProductPage;
