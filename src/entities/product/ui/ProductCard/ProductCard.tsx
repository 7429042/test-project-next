import {IProduct} from '@/entities/product/model';
import {ReactNode} from 'react';
import {Card, CardBody, CardHeader, Image} from '@heroui/react';
import Actions from '@/entities/product/ui/Actions/Actions';
import Link from 'next/link';

interface ProductCardProps {
    product: IProduct;
    href?: string;
    actions?: ReactNode;
}


function ProductCard({product, href, actions}: ProductCardProps) {
    return (
        <Card className="h-full flex flex-col py-4">
            <CardHeader className="pb-0 pt-2 px-4 flow-root">
                <div className="float-right shrink-0 ml-3 mb-1" onClick={(e) => e.stopPropagation()}>
                    {actions && <Actions id={product.id}/>} {/* как и было */}
                </div>
                <div className="min-w-0">
                    {href ? (
                        <Link href={href} className="block focus:outline-none">
                            <h4 className="font-bold text-2xl line-clamp-2">{product.title}</h4>
                            <p className="text-sm line-clamp-3">{product.description}</p>
                            <small className="text-sm text-muted-foreground">{product.price} $</small>
                        </Link>
                    ) : (
                        <>
                            <h4 className="font-bold text-2xl line-clamp-2">{product.title}</h4>
                            <p className="text-sm line-clamp-3">{product.description}</p>
                            <small className="text-sm text-muted-foreground">{product.price} $</small>
                        </>
                    )}
                </div>
            </CardHeader>
            <CardBody className="overflow-visible py-2 mt-auto">
                {href ? (
                    <Link href={href} className="block">
                        <div className="w-full rounded-xl bg-content1 grid place-items-center">
                            <div className="w-full h-44 sm:h-52 md:h-60">
                                <Image alt={product.title} src={product.image}
                                       className="w-full h-full object-contain overflow-hidden" loading="lazy"/>
                            </div>
                        </div>
                    </Link>
                ) : (
                    <div className="w-full rounded-xl bg-content1 grid place-items-center">
                        <div className="w-full h-44 sm:h-52 md:h-60">
                            <Image alt={product.title} src={product.image}
                                   className="w-full h-full object-contain overflow-hidden" loading="lazy"/>
                        </div>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}

export default ProductCard;
