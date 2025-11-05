'use client';

import {useEffect, useMemo} from 'react';

// Custom 404 page for GitHub Pages.
// When a deep link is opened directly, GH Pages returns 404.html.
// We use client-side script to redirect back into the SPA/static route inside the repo basePath.

const REPO = 'test-project-next'; // keep in sync with next.config.ts

function buildRedirectUrl(loc: Location) {
    const base = `/${REPO}/`;
    let pathname = loc.pathname || '/';

    // Strip the repo prefix if present to avoid duplication
    if (pathname.startsWith(base)) {
        pathname = pathname.slice(base.length);
    } else if (pathname.startsWith('/')) {
        pathname = pathname.slice(1);
    }

    // Ensure trailing slash so that GH Pages serves .../index.html
    const normalizedPath = pathname.endsWith('/') ? pathname : `${pathname}/`;

    const search = loc.search || '';
    const hash = loc.hash || '';

    return `${base}${normalizedPath}${search}${hash}`;
}

export default function NotFound() {
    const href = useMemo(() => {
        if (typeof window === 'undefined') return '/';
        try {
            return buildRedirectUrl(window.location);
        } catch {
            return '/';
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const target = buildRedirectUrl(window.location);
            if (target && target !== window.location.href) {
                window.location.replace(target);
            }
        } catch {
            // ignore
        }
    }, []);

    return (
        <div style={{padding: 24, textAlign: 'center'}}>
            <h1>Перенаправление…</h1>
            <p>
                Если перенаправление не произошло автоматически, нажмите:
                {' '}
                <a href={href}>вернуться на сайт</a>
            </p>
        </div>
    );
}
