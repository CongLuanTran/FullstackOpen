import { useQueryClient, useMutation } from '@tanstack/react-query'
import blogService from '../services/blogs'

export const useUpdateBlog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (blog) => blogService.update(blog.id, blog),
    onMutate: (blog) => {
      console.log('updating', blog)
    },
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(['blogs'], (blogs) =>
        blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
      )
    },
  })
}
