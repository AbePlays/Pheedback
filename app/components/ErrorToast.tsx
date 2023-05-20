interface ErrorProps {
  children?: React.ReactNode
}

export default function ErrorToast(props: ErrorProps) {
  const { children } = props

  return (
    <div className="mx-auto max-w-md p-4">
      <div
        className="space-y-2 rounded-lg border border-red-700 bg-red-100 p-4 text-center text-red-500 shadow animate-in slide-in-from-top-full duration-500 dark:bg-red-400 dark:text-red-100"
        role="alert"
      >
        {children}
      </div>
    </div>
  )
}
