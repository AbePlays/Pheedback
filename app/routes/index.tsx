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
      <main>
        <h2 className="text-red-900 font-bold">Welcome to Pheedback!</h2>
        <p className="text-green-800">We're stoked that you're here. 🥳</p>
      </main>
    </div>
  )
}
