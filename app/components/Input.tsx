export default function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const commonClasses = 'w-full rounded-lg border outline-none px-3 h-12 focus:ring-2'
  const lightClasses = 'border-gray-300 bg-gray-100 text-gray-500 focus:ring-fuchsia-700'
  const darkClasses =
    'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:ring-fuchsia-400'

  return <input className={`${commonClasses} ${lightClasses} ${darkClasses} ${className}`.trim()} {...props} />
}
