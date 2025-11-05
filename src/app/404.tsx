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
            const current = window.location.pathname + (window.location.search || '') + (window.location.hash || '');
            const fullCurrent = (window.location.origin ? window.location.origin : '') + current;
            const base = `/${REPO}/`;
            const to = target && target !== window.location.href ? target : base;
            if (to && to !== fullCurrent && to !== current) {
                window.location.replace(to);
            } else if (window.location.pathname.indexOf(base) !== 0) {
                window.location.replace(base);
            }
        } catch {
            // ignore
        }
    }, []);

    return (
        <div style={{padding: 24, textAlign: 'center'}}>
            {/* Inline immediate redirect for GitHub Pages before hydration */}
            <script
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                    __html: `(() => {
  try {
    var REPO='${REPO}';
    var base='/' + REPO + '/';
    var loc=window.location;
    var pathname=loc.pathname||'/';
    if (pathname.indexOf(base)===0) { pathname = pathname.slice(base.length); }
    else if (pathname.indexOf('/')===0) { pathname = pathname.slice(1); }
    var normalized = pathname.endsWith('/') ? pathname : (pathname + '/');
    var target = base + normalized + (loc.search||'') + (loc.hash||'');
    var current = loc.pathname + (loc.search||'') + (loc.hash||'');
    var fullCurrent = (loc.origin?loc.origin:'') + current;
    var to = (target && target !== loc.href) ? target : base;
    if (to && to !== fullCurrent && to !== current) {
      loc.replace(to);
    } else if (loc.pathname.indexOf(base) !== 0) {
      loc.replace(base);
    }
    setTimeout(function(){ if (window.location.pathname.indexOf(base)!==0){ try{ loc.replace(base); }catch(_){} } }, 200);
  } catch(_) {}
})()`
                }}
            />
            <h1>Перенаправление…</h1>
            <p>
                Если перенаправление не произошло автоматически, нажмите:{' '}
                <a href={href}>вернуться на сайт</a>
            </p>
        </div>
    );
}
