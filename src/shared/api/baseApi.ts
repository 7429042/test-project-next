import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {IProduct} from '@/entities/product/model';

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL
    }),
    endpoints: (builder) => ({
        getProducts: builder.query<IProduct[], void>({
            query: () => 'products'
        }),
        getProductById: builder.query<IProduct, number | string>({
            query: (id) => `products/${id}`
        })
    })
});

export const {useGetProductsQuery, useGetProductByIdQuery} = baseApi;