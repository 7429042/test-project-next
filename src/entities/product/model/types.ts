export type ProductId = string | number;

export interface IProduct {
    id: ProductId,
    title: string,
    price: number,
    description: string,
    category: string,
    image: string
}