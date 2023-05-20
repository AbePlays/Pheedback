import { type LinksFunction } from '@remix-run/node'
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from '@remix-run/react'

import globalStyles from '~/styles/global.css'
import appStyles from '~/styles/tailwind.css'
import { ErrorToast } from './components'

// https://remix.run/api/app#links
export const links: LinksFunction = () => {
  return [
    {
      rel: 'preload',
      href: '/background-header.png',
      as: 'image',
      type: 'image/png',
    },
    { rel: 'stylesheet', href: globalStyles },
    { rel: 'stylesheet', href: appStyles },
  ]
}

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary() {
  const error = useRouteError()

  let children: React.ReactNode = <p>Something went wrong. Please try again after some time.</p>

  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 401:
        children = (
          <p>
            Access Denied. To access this page, please{' '}
            <Link className="inline-block underline" prefetch="intent" to="/auth">
              log in
            </Link>{' '}
            to your account.
          </p>
        )
        break
      case 404:
        children = (
          <>
            <p>Page not found.</p>
            <Link className="inline-block underline" prefetch="intent" to="/">
              Go Home
            </Link>
          </>
        )
        break
      default:
        break
    }
  }

  return (
    <Document title="Error!">
      <ErrorToast>{children}</ErrorToast>
    </Document>
  )
}

function Document({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-50 dark:bg-neutral-900">
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>
}
