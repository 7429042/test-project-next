import {IProduct} from '@/entities/product/model';
import {ReactNode} from 'react';
import {Avatar, Badge, Card, CardBody, CardHeader, Image, Link} from '@heroui/react';

interface ProductCardProps {
    product: IProduct;
    href?: string;
    actions?: ReactNode;
}


function ProductCard({product, href, actions}: ProductCardProps) {
    const content = (
        <Card key={product.id} className="h-full py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-2xl line-clamp-2">{product.title}</h4>

                <p className="text-sm line-clamp-3">{product.description}</p>
                <small className="text-sm text-muted-foreground">{product.price}</small>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                <div className="w-full h-40 rounded-xl relative">
                    <Badge
                        content={product.category}
                        color="primary"
                        placement="top-left"
                        variant="solid"
                        size="sm"
                    >

                        <Image alt={product.title} src={product.image}
                               className="w-full h-full object-contain overflow-hidden"
                               loading="lazy"/>
                    </Badge>

                </div>
            </CardBody>
        </Card>

    );
    return href ? (
        <Link href={product.title}>{content}</Link>
    ) : (
        content
    );
}

export default ProductCard;
