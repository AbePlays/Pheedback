interface ErrorProps {
  children?: React.ReactNode
}

export default function ErrorToast(props: ErrorProps) {
  const { children } = props

  return (
    <div className="mx-auto max-w-md p-4" role="alert">
      <main className="space-y-2 rounded-lg border border-red-700 bg-red-100 p-4 text-center text-red-500 shadow duration-500 animate-in slide-in-from-top-full">
        {children}
      </main>
    </div>
  )
}
