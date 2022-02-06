const validateCommentForm = (data: Record<string, unknown>) => {
  if (
    !data.comment ||
    typeof data.comment !== 'string' ||
    !data.comment.trim()
  ) {
    return {
      fields: { ...data },
      fieldErrors: { comment: 'Comment is required' },
    }
  }

  if (
    !data.postId ||
    typeof data.postId !== 'string' ||
    !data.userId ||
    typeof data.userId !== 'string'
  ) {
    return {
      fields: { ...data },
      formError: 'Form invalid',
    }
  }
}

export default validateCommentForm
