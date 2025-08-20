import { useQuery } from '@tanstack/react-query'
import blogService from '../services/blogs'
import Blog from './Blog'

const BlogList = () => {
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  if (result.isLoading) {
    return <p>Loading...</p>
  }

  const blogs = result.data
  const byLikes = (a, b) => b.likes - a.likes

  return (
    <div>
      {[...blogs].sort(byLikes).map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default BlogList
