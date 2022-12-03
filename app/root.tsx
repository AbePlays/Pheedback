import { type LinksFunction } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch } from '@remix-run/react'

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
  return (
    <Document title="Error!">
      <ErrorToast>
        <p>Something went wrong. Please try again after some time.</p>
      </ErrorToast>
    </Document>
  )
}

// https://remix.run/docs/en/v1/api/conventions#catchboundary
export function CatchBoundary() {
  const caught = useCatch()

  let message
  switch (caught.status) {
    case 401:
      message = <p>Oops! Looks like you tried to visit a page that you do not have access to.</p>
      break
    case 404:
      message = <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      break

    default:
      throw new Error(caught.data || caught.statusText)
  }

  return (
    <Document title="Error">
      <ErrorToast>
        <p>{message}</p>
      </ErrorToast>
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
