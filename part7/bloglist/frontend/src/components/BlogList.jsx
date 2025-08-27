import { useBlogs } from '../hooks/useBlogs'
import { Link } from 'react-router-dom'

const BlogList = () => {
  const { data: blogs, isLoading } = useBlogs()

  if (isLoading) {
    return <p>Loading...</p>
  }

  const byLikes = (a, b) => b.likes - a.likes

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div>
      {[...blogs].sort(byLikes).map((blog) => (
        <div key={blog.id} style={style}>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} by {blog.author}
          </Link>
        </div>
      ))}
    </div>
  )
}

export default BlogList
