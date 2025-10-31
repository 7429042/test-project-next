'use client';
import {HeroUIProvider} from '@heroui/react';
import {Provider} from 'react-redux';
import {ReactNode} from 'react';
import store from '@/processes/app/store';

export function AppProviders({children}: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <HeroUIProvider>
                {children}
            </HeroUIProvider>
        </Provider>

    );
}