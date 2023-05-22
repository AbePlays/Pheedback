import type { FunctionComponent } from 'react'
import { Form } from '@remix-run/react'

import { Button } from '~/components'
import { categoryOptions } from '~/data'

interface Props {
  category: string
  isFormSubmitting: boolean
  sortBy: string
}

const CategoryFilter: FunctionComponent<Props> = ({ category, isFormSubmitting, sortBy }) => {
  return (
    <Form action="/" className="flex flex-wrap gap-4">
      <input type="hidden" name="sortBy" value={sortBy || ''} />
      <Button
        className={`h-max w-max rounded-lg px-3 py-2 text-sm font-semibold hover:bg-blue-300 focus:ring-blue-500 ${
          !category ? '!bg-blue-500 text-white' : ''
        }`}
        disabled={isFormSubmitting}
        name="category"
        value=""
      >
        All
      </Button>
      {categoryOptions.map((cat) => (
        <Button
          className={`h-max w-max rounded-lg px-3 py-2 text-sm font-semibold hover:bg-blue-300 focus:ring-blue-500 ${
            category === cat ? '!bg-blue-500 text-white' : ''
          }`}
          disabled={isFormSubmitting}
          key={cat}
          name="category"
          value={cat}
        >
          {cat}
        </Button>
      ))}
    </Form>
  )
}

export default CategoryFilter
