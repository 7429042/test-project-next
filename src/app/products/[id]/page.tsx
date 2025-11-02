'use client';
import {useParams, useRouter} from 'next/navigation';
import {useGetProductByIdQuery} from '@/shared/api/baseApi';
import {Button, ButtonGroup, Card, CardBody, CardHeader, Image, Skeleton, Spinner} from '@heroui/react';



function Page() {
    const params = useParams<{ id: string }>();
    const {data, isLoading, error} = useGetProductByIdQuery(params.id);
    const router = useRouter();

    if (isLoading) {
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

    if (error) {
        return <div>Error: {String(error)}</div>;
    }


    return (
        <Card className="p-4">
            <CardHeader className="px-4 flex-col gap-2 items-center">
                <h4 className="font-bold text-3xl pb-2">{data?.title}</h4>
                <p className="text-2xl text-center text-default-700 uppercase font-bold">{data?.description}</p>
                <small className="text-default-700 text-lg">{data?.price} $</small>
            </CardHeader>
            <CardBody className="overflow-visible flex-col items-center py-2">
                <Image
                    alt="Card background"
                    className="object-cover rounded-xl pb-4"
                    src={data?.image}
                    width={320}
                />
                <ButtonGroup variant="shadow">
                    <Button
                        onPress={() => router.push('/products')}
                        variant="flat"
                        color="primary"
                        size="md"
                    >На главную</Button>


                    <Button
                        variant="flat"
                        color="warning"
                        size="md"
                    >Редактировать</Button>
                </ButtonGroup>
            </CardBody>
        </Card>
    );
}

export default Page;