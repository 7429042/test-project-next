'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {selectLocalById} from '@/entities/product/model/productLocalSlice';
import {useGetProductByIdQuery} from '@/shared/api/baseApi';
import {Button, ButtonGroup, Card, CardBody, CardHeader, Image, Skeleton} from '@heroui/react';
import Link from 'next/link';

export default function UniversalProductPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const idParam = (searchParams.get('id') ?? '').trim();

    // Если id пуст — можно показать 404-вид или увезти на список
    useEffect(() => {
        if (!idParam) router.replace('/products/');
    }, [idParam, router]);

    // Пробуем распознать числовой id (API)
    const idNum = Number(idParam);
    const isApiNumeric = Number.isInteger(idNum) && idNum > 0;

    // Для локальных товаров берём из Redux (важно: обеспечить гидратацию из localStorage — см. п. 4)
    const localProduct = useSelector(selectLocalById(idParam));
    const {data, isLoading, isFetching} = useGetProductByIdQuery(idNum, {
        skip: !isApiNumeric || Boolean(localProduct),
    });

    const product = useMemo(() => localProduct ?? (isApiNumeric ? data : undefined), [localProduct, isApiNumeric, data]);

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
            </Card>
        );
    }
    if (!product) {
        return <div className="p-6">Товар не найден</div>;
    }

    return (
        <Card className="p-4">
            <CardHeader className="px-4 flex-col gap-2 items-center">
                <h4 className="font-bold text-3xl pb-2">{product.title}</h4>
                <p className="text-2xl text-center text-default-700 uppercase font-bold">{product.description}</p>
                <small className="text-default-700 text-lg">{product.price} $</small>
            </CardHeader>
            <CardBody className="overflow-visible flex-col items-center py-2 gap-4">
                <Image alt={product.title} className="object-cover rounded-xl pb-4" src={product.image} width={320}/>
                <ButtonGroup variant="shadow">
                    <Button as={Link} href="/products/" variant="flat" color="primary" size="md">
                        На главную
                    </Button>
                </ButtonGroup>
            </CardBody>
        </Card>
    );
}
