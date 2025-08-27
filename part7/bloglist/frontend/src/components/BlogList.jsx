import { useBlogs } from '../hooks/useBlogs'

const BlogList = () => {
  const { data: blogs, isLoading } = useBlogs()

  if (isLoading) {
    return <p>Loading...</p>
  }

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
