import {Card, CardBody, CardHeader, Skeleton} from '@heroui/react';

function ProductCardSkeleton() {
    return (
        <Card className="h-full flex flex-col py-4">
            <CardHeader className="pb-0 pt-2 px-4 flow-root">
                <div className="float-right shrink-0 ml-2 mb-1 flex items-center gap-2">
                    <Skeleton className="rounded-full" style={{width: 36, height: 36}}/>
                    <Skeleton className="rounded-full" style={{width: 36, height: 36}}/>
                </div>
                <div className="min-w-0 space-y-2">
                    <Skeleton className="h-7 w-full rounded-md"/>
                    <div className="space-y-1.5">
                        <Skeleton className="h-4 w-full rounded-md"/>
                        <Skeleton className="h-4 w-11/12 rounded-md"/>
                        <Skeleton className="h-4 w-10/12 rounded-md"/>
                    </div>
                    <Skeleton className="h-4 w-28 rounded-md"/>
                </div>
            </CardHeader>
            <CardBody className="overflow-visible py-2 mt-auto">
                <div className="w-full rounded-xl bg-content1 grid place-items-center">
                    <div className="w-full h-44 sm:h-52 md:h-60">
                        <Skeleton className="w-full h-full rounded-xl"/>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

export default ProductCardSkeleton;
