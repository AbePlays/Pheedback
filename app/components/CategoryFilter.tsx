import type { FunctionComponent } from 'react'
import { Form } from 'remix'

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
        className={`h-max w-max rounded-lg py-2 px-3 text-sm font-semibold hover:bg-blue-100 focus:ring-blue-500 ${
          !category ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-500'
        }`}
        disabled={isFormSubmitting}
        name="category"
        value=""
      >
        All
      </Button>
      {categoryOptions.map((cat) => (
        <Button
          className={`h-max w-max rounded-lg py-2 px-3 text-sm font-semibold hover:bg-blue-100 focus:ring-blue-500 ${
            category === cat ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-500'
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
