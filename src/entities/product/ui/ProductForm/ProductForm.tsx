'use client';

import {IProduct} from '@/entities/product/model';
import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {Button} from '@heroui/react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

export type ProductFormValues = {
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
};

export type ProductFormProps = {
    defaultValues: ProductFormValues;
    onSubmitAction: (values: ProductFormValues) => void | Promise<void>;
    submitLabel?: string;
    idForDisplay?: IProduct['id'];
};

const rules = {
    title: {required: 'Название обязательно'},
    price: {
        required: 'Цена обязательна',
        valueAsNumber: true as const,
        validate: (v: number) => (v > 0) || 'Цена должна быть больше 0',
    },
    category: {required: 'Категория обязательна'},
    image: {
        required: 'Ссылка обязательна',
        // Лёгкая проверка URL (без сторонних библиотек)
        validate: (v: string) => {
            try {
                new URL(v);
                return true;
            } catch {
                return 'Некорректный URL';
            }
        }
    },
    description: {
        required: 'Описание обязательно',
        minLength: {value: 10, message: 'Минимум 10 символов'},
    },
};

export default function ProductForm({
                                        defaultValues,
                                        onSubmitAction,
                                        submitLabel = 'Сохранить',
                                        idForDisplay
                                    }: ProductFormProps) {
    const {register, handleSubmit, reset, formState: {errors, isSubmitting}} = useForm<ProductFormValues>({
        mode: 'onSubmit',
        defaultValues,
    });

    const router = useRouter();

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmitAction)} className="space-y-4">
            {idForDisplay !== undefined && (
                <div>
                    <label className="block text-sm font-medium mb-1">ID</label>
                    <input className="w-full border rounded px-3 py-2 bg-gray-100" disabled
                           value={String(idForDisplay)}/>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium mb-1">Название</label>
                <input className="w-full border rounded px-3 py-2" placeholder="Например: iPhone 15"
                       {...register('title', rules.title)} />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Цена</label>
                <input type="number" step="0.01" className="w-full border rounded px-3 py-2"
                       placeholder="Например: 999.99"
                       {...register('price', rules.price)} />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message as string}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Категория</label>
                <input className="w-full border rounded px-3 py-2" placeholder="Например: electronics"
                       {...register('category', rules.category)} />
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Ссылка на изображение</label>
                <input className="w-full border rounded px-3 py-2" placeholder="https://..."
                       {...register('image', rules.image)} />
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message as string}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Описание</label>
                <textarea className="w-full border rounded px-3 py-2" rows={4} placeholder="Короткое описание"
                          {...register('description', rules.description)} />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="flat" color="primary" type="submit"
                        className="w-full" disabled={isSubmitting}
                >
                    {isSubmitting ? 'Сохраняю…' : submitLabel}
                </Button>

                    <Button variant="flat" onPress={() => router.push('/')}
                            className="w-full" color="warning" size="md">
                        Отмена
                    </Button>

            </div>
        </form>
    );
}
