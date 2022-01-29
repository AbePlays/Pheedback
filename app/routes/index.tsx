import type { MetaFunction } from 'remix'

// https://remix.run/api/conventions#meta
export const meta: MetaFunction = () => {
  return {
    title: 'Home | Pheedback',
    description: 'Welcome to Pheedback!',
  }
}

// https://remix.run/guides/routing#index-routes
export default function Index() {
  return (
    <div>
      <main className="text-center">
        <h2 className="font-bold text-red-900 first-letter:text-xl">
          Welcome to Pheedback!
        </h2>
        <p className="text-green-800">We're stoked that you're here. 🥳</p>
        <p className="text-cyan-500">Content coming soon!</p>
      </main>
    </div>
  )
}
