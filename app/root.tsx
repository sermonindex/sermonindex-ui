import type {LinksFunction, MetaFunction} from '@remix-run/node';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
  useRouteError,
} from '@remix-run/react';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useEffect } from 'react';
import { ErrorDisplay } from './components/error-page';
import { SiSection } from './components/section';
import { SiPage } from './components/si-page';
import './tailwind.css';

// Set up NProgress
NProgress.configure({ showSpinner: false });

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  let status = 500;
  let heading = 'An unexpected error occurred.';
  let message = 'We are very sorry, but something went wrong.';

  if (isRouteErrorResponse(error)) {
    status = error.status;
    heading = error.statusText;

    if (error.status === 404) {
      heading = 'Oops! Page Not Found.';
      message =
        'The page you are looking for does not exist, has been removed, or is temporarily unavailable.';
    } else {
      message =
        error.data?.message ||
        'Something went wrong on our end. Please try again later.';
    }
  }

  return (
    <html lang="en" className="h-full">
      <head>
        <title>Oh no! An error occurred.</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <main>
          <SiPage showBreadCrumb={false}>
            <SiSection>
              <ErrorDisplay
                status={status}
                heading={heading}
                message={message}
              />
            </SiSection>
          </SiPage>
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === 'loading') {
      NProgress.start();
    } else if (navigation.state === 'idle') {
      NProgress.done();
    }
  }, [navigation.state]);

  return (
    <html lang="en">
      <head>
        {/* Note: We set title through the meta function */}
        {/* Metadata is nested, see the MetaFunction and remix meta docs */}
        <Meta />
        <Links />
      </head>
      <body>
        <main>
          {/* Note: See app/components/si-page.tsx */}
          {/* We don't want to render components client side! */}
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
