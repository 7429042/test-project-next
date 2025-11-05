'use client';
import {useGetProductByIdQuery} from '@/shared/api/baseApi';
import {Button, ButtonGroup, Card, CardBody, CardHeader, Image, Skeleton, Spinner} from '@heroui/react';
import {useDispatch, useSelector} from 'react-redux';
import {selectLocalById, upsertProduct} from '@/entities/product/model/productLocalSlice';
import {IProduct} from '@/entities/product/model';
import {useMemo, useState} from 'react';
import {AppDispatch} from '@/processes/app/store';
import ProductForm, {ProductFormValues} from '@/entities/product/ui/ProductForm/ProductForm';
import Link from 'next/link';

export default function ProductPageClient({id, initialProduct}: { id: number | string; initialProduct?: IProduct }) {
    const dispatch = useDispatch<AppDispatch>();
    const localProduct = useSelector(selectLocalById(id));

    // Для числовых id (fakestoreapi) можно делать сетевой запрос.
    const numericId = typeof id === 'string' ? Number(id) : id;
    const isNumericValid = Number.isInteger(numericId) && (numericId as number) > 0;

    const {data, isLoading, isFetching, error} = useGetProductByIdQuery(numericId as number, {
        // Не пропускаем клиентский запрос из‑за initialProduct — на GitHub Pages билдовый фетч может не отработать
        // Локальный кэш из редакса имеет приоритет и может пропустить сетевой запрос
        // Также пропускаем запрос, если id не числовой (например, UUID локально созданного товара)
        skip: Boolean(localProduct) || !isNumericValid,
    });

    const product: IProduct | undefined = useMemo(
        () => localProduct ?? initialProduct ?? data,
        [localProduct, initialProduct, data]
    );
    const [editMode, setEditMode] = useState(false);
    if (!product && (isLoading || isFetching)) {
        return (
            <Card className="p-4">
                <CardHeader className="px-4 flex-col gap-2 items-center">
                    <Skeleton className="rounded-md w-56 h-8"/>
                    <Skeleton className="rounded-md w-72 h-6"/>
                    <Skeleton className="rounded-md w-24 h-5"/>
                </CardHeader>
                <CardBody className="overflow-visible flex-col items-center py-2 gap-4">
                    <Skeleton className="rounded-xl w-[320px] h-[240px]"/>
                    <div className="flex gap-2">
                        <Skeleton className="rounded-medium h-10 w-28"/>
                        <Skeleton className="rounded-medium h-10 w-32"/>
                    </div>
                </CardBody>
                <Spinner/>
            </Card>
        );
    }
    if (!localProduct && error) {
        return <div>Error: {String(error)}</div>;
    }

    if (!product) {
        return <div className="p-6">Товар не найден</div>;
    }

    const defaults: ProductFormValues = {
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
    };

    const handleUpdate = (values: ProductFormValues) => {
        dispatch(upsertProduct({id: product.id, ...values}));
        setEditMode(false);
    };
    return (
        <Card className="p-4">
            <CardHeader className="px-4 flex-col gap-2 items-center">
                <h4 className="font-bold text-3xl pb-2">{product.title}</h4>
                <p className="text-2xl text-center text-default-700 uppercase font-bold">{product.description}</p>
                <small className="text-default-700 text-lg">{product.price} $</small>
            </CardHeader>
            <CardBody className="overflow-visible flex-col items-center py-2 gap-4">
                {!editMode ? (
                    <>
                        <Image alt="Card background" className="object-cover rounded-xl pb-4" src={product.image}
                               width={320}/>
                        <ButtonGroup variant="shadow">
                            <Button as={Link} href="/products/" variant="flat" color="primary" size="md">
                                На главную
                            </Button>
                            <Button variant="flat" color="warning" size="md" onPress={() => setEditMode(true)}>
                                Редактировать
                            </Button>
                        </ButtonGroup>
                    </>
                ) : (
                    <div className="w-full max-w-xl">
                        <ProductForm defaultValues={defaults} submitLabel="Сохранить" onSubmitAction={handleUpdate}
                                     idForDisplay={product.id}/>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
