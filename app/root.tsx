import type { LinksFunction } from "@remix-run/node";
import {
    Link,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLocation,
} from "@remix-run/react";

import "./tailwind.css";

export const links: LinksFunction = () => [
  {rel: "preconnect", href: "https://fonts.googleapis.com"},
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

const Pages = ["speakers", "sermons", "bible", "about"];

export default function App() {
  const location = useLocation();

  return (
    <html lang="en">
    <head>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <Meta/>
      <Links/>
    </head>
    <body>
    <header className="fixed top-0 left-0 w-full z-10">
      <div className="flex px-4 min-h-4 items-center justify-left bg-si-main">
        <Link to="/">
          <img
            className="h-20 py-3 pr-8"
            src="/sermon-index.svg"
            alt="sermon-index"
          />
        </Link>
        <div className="flex space-x-6">
          {Pages.map((page) => {
            const active = location.pathname === `/${page}`;
                return (
                  <Link
                    className={`block capitalize font-semibold text-white ${
                      active ? "text-yellow-600" : ""
                    } hover:text-yellow-600`}
                    key={page}
                    to={`/${page}`}
                  >
                    {page}
                  </Link>
                );
              })}
            </div>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
