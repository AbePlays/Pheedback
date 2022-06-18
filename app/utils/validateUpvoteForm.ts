const validateUpvoteForm = (data: Record<string, unknown>) => {
  if (!data?.postId || !data?.userId) {
    return { formError: 'Please fill in all the fields' }
  }
  const { postId, userId } = data

  if (typeof postId !== 'string' || typeof userId !== 'string') {
    return { formError: 'Invalid fields' }
  }
}

export default validateUpvoteForm
