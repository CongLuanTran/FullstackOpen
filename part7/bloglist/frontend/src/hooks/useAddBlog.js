import { useQueryClient, useMutation } from '@tanstack/react-query'
import blogService from '../services/blogs'

export const useAddBlog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: blogService.create,
    onMutate: (blog) => {
      console.log('creating', blog)
    },
    onSuccess: (newBlog) => {
      queryClient.setQueryData(['blogs'], (blogs) => blogs.concat(newBlog))
    },
  })
}
