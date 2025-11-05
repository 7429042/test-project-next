import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {IProduct} from '@/entities/product/model';
import {ProductId} from '@/entities/product/model/types';

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'https://fakestoreapi.com/'
    }),
    endpoints: (builder) => ({
        getProducts: builder.query<IProduct[], void>({
            query: () => 'products'
        }),
        getProductById: builder.query<IProduct, ProductId>({
            query: (id) => `products/${id}`
        })
    })
});

export const {useGetProductsQuery, useGetProductByIdQuery} = baseApi;