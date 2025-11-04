'use client';
import {useParams, useRouter} from 'next/navigation';
import {useGetProductByIdQuery} from '@/shared/api/baseApi';
import {Button, ButtonGroup, Card, CardBody, CardHeader, Image, Skeleton, Spinner} from '@heroui/react';
import {useDispatch, useSelector} from 'react-redux';
import {selectLocalById, upsertProduct} from '@/entities/product/model/productLocalSlice';
import {IProduct} from '@/entities/product/model';
import {useMemo, useState} from 'react';
import {AppDispatch} from '@/processes/app/store';
import ProductForm, {ProductFormValues} from '@/entities/product/ui/ProductForm/ProductForm';

function Page() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const localProduct = useSelector(selectLocalById(params.id));
    const {data, isLoading, error} = useGetProductByIdQuery(params.id, {
        skip: Boolean(localProduct),
    });

    const product: IProduct | undefined = useMemo(() => {
        return localProduct ?? (data as IProduct | undefined);
    }, [localProduct, data]);

    const [editMode, setEditMode] = useState(false);

    if (!localProduct && isLoading) {
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
        // сохраняем с тем же id (id менять нельзя)
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
                        <Image
                            alt="Card background"
                            className="object-cover rounded-xl pb-4"
                            src={product.image}
                            width={320}
                        />
                        <ButtonGroup variant="shadow">
                            <Button onPress={() => router.push('/products')} variant="flat" color="primary" size="md">
                                На главную
                            </Button>
                            <Button variant="flat" color="warning" size="md" onPress={() => setEditMode(true)}>
                                Редактировать
                            </Button>
                        </ButtonGroup>
                    </>
                ) : (
                    <div className="w-full max-w-xl">
                        <ProductForm
                            defaultValues={defaults}
                            submitLabel="Сохранить"
                            onSubmitAction={handleUpdate}
                            idForDisplay={product.id}
                        />
                    </div>
                )}
            </CardBody>
        </Card>
    );
}

export default Page;