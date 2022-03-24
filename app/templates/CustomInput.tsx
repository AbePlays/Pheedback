import type { FunctionComponent } from 'react'

import { Input } from '~/components'

interface Props {
  defaultValue: string
  error: string
  id: string
  label: string
  type?: React.InputHTMLAttributes<HTMLInputElement>['type']
}

const CustomInput: FunctionComponent<Props> = ({ defaultValue, error, id, label, type = 'text' }) => {
  return (
    <div className="space-y-4">
      <label className="font-bold" htmlFor={`${id}-input`}>
        {label}
      </label>
      <Input
        type={type}
        id={`${id}-input`}
        name={id}
        defaultValue={defaultValue}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error ? (
        <p className="text-sm text-red-600" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default CustomInput
