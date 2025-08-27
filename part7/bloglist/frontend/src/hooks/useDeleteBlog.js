import { useQueryClient, useMutation } from '@tanstack/react-query'
import blogService from '../services/blogs'

export const useDeleteBlog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (blog) => blogService.remove(blog.id),
    onMutate: (blog) => {
      console.log('deleting', blog)
    },
    onSuccess: (_data, blog) => {
      queryClient.setQueryData(['blogs'], (blogs) =>
        blogs.filter((b) => b.id != blog.id)
      )
    },
  })
}
