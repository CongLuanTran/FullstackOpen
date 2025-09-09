import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'

export const useAddComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, text }) => blogService.addComment(id, text),
    onMutate: ({ text }) => {
      console.log('adding comment', text)
    },
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(['blogs'], (blogs) =>
        blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
      )
    },
  })
}
