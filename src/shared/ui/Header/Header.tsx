'use client';
import {Button, Input, Navbar, NavbarContent, NavbarItem} from '@heroui/react';
import {SearchIcon} from '@heroui/shared-icons';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useCallback, useEffect, useRef, useState} from 'react';

function Header() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathName = usePathname();

    const qParam = searchParams.get('q') ?? '';
    const [value, setValue] = useState(qParam);

    useEffect(() => {
        setValue(qParam);
    }, [qParam]);

    const setQueryParam = useCallback(
        (key: string, val: string | null) => {
            const params = new URLSearchParams(searchParams.toString());
            if (val && val.length > 0) params.set(key, val);
            else params.delete(key);
            // Сбрасываем страницу на 1 при изменении поиска (если есть пагинация в URL — опционально)
            params.delete('page');
            router.replace(`${pathName}?${params.toString()}`);
        },
        [router, pathName, searchParams]
    );

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const debouncedUpdate = useCallback((next: string) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            const trimmed = next.trim();
            setQueryParam('q', trimmed === '' ? null : trimmed);
        }, 300);
    }, [setQueryParam]);

    // Очищаем таймер при размонтировании/смене зависимостей
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <Navbar isBordered className="bg-background">
            <NavbarContent as="div" className="items-center flex-1" justify="start">
                <Input
                    classNames={{
                        base: 'w-full h-10',
                        mainWrapper: 'h-full',
                        input: 'text-small',
                        inputWrapper:
                            'h-full font-normal text-default-700 bg-default-400/20 dark:bg-default-500/20',
                    }}
                    placeholder="Поиск..."
                    size="lg"
                    startContent={<SearchIcon width={18}/>}
                    type="search"
                    value={value}
                    onChange={(e) => {
                        const next = e.target.value;
                        setValue(next);
                        debouncedUpdate(next);
                    }}
                    onClear={() => {
                        setValue('');
                        setQueryParam('q', null);
                    }}
                    isClearable
                />
            </NavbarContent>
            <NavbarContent as="div" className="items-center shrink-0" justify="end">
                <NavbarItem>
                    <Button color="primary" variant="flat" onPress={() => router.push('/create-product')}>
                        Добавить продукт
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}

export default Header;
