'use client';
import {HeroUIProvider} from '@heroui/react';
import {Provider} from 'react-redux';
import {ReactNode} from 'react';
import store from '@/processes/app/store';
import {ThemeProvider} from 'next-themes';

export function AppProviders({children}: { children: ReactNode }) {
    return (
        <Provider store={store}>

            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                themes={['light', 'dark']}
            >
                <HeroUIProvider>
                    {children}
                </HeroUIProvider>

            </ThemeProvider>
        </Provider>

    );
}