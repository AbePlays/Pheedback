const validateEditPostForm = (data: Record<string, unknown>) => {
  if (
    !data?.title ||
    typeof data?.title !== 'string' ||
    !data?.category ||
    typeof data?.category !== 'string' ||
    !data?.detail ||
    typeof data?.detail !== 'string' ||
    !data?.status ||
    typeof data?.status !== 'string'
  ) {
    return { formError: 'Form not submitted correctly.' }
  }

  if (data.title.trim().length < 2) {
    return {
      fields: { ...data },
      fieldErrors: { title: 'Title must be at least 2 characters.' },
    }
  }

  if (data.detail.trim().length < 5) {
    return {
      fields: { ...data },
      fieldErrors: { detail: 'Detail must be at least 5 characters.' },
    }
  }
}

export default validateEditPostForm
