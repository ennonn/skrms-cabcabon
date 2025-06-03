import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { type RouteName, route } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Initialize route function globally
global.route = (name: string, params: any = {}, absolute: boolean = true) => {
    try {
        return route(name, params, absolute);
    } catch (error) {
        console.error('Route error:', error);
        return '/';
    }
};

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
        setup: ({ App, props }) => {
            // Update Ziggy's configuration with the current request
            if (page.props.ziggy) {
                global.route = (name: string, params: any = {}, absolute: boolean = true) => {
                    try {
                        return route(name, params, absolute, {
                            ...page.props.ziggy,
                            location: new URL(page.props.ziggy.location),
                        });
                    } catch (error) {
                        console.error('Route error:', error);
                        return '/';
                    }
                };
            }

            return <App {...props} />;
        },
    }),
);
