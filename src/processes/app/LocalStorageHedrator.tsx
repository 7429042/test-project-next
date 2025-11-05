'use client';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {upsertProduct} from '@/entities/product/model/productLocalSlice';
import type {AppDispatch} from '@/processes/app/store';
import type {IProduct} from '@/entities/product/model';

export default function LocalStorageHydrator() {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        try {
            const raw = localStorage.getItem('localProducts');
            if (!raw) return;

            const byId: Record<string, IProduct> = JSON.parse(raw);
            Object.values(byId).forEach((p) => {
                dispatch(upsertProduct(p));
            });
        } catch {
            // noop: некорректные данные в localStorage — просто пропустим
        }
    }, [dispatch]);

    return null;
}