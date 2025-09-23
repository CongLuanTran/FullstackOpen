import { Stack } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useBlogs } from '../hooks/useBlogs'

const BlogList = ({ className }) => {
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
    <Stack className={className} gap={1}>
      {[...blogs].sort(byLikes).map((blog) => (
        <div key={blog.id} style={style}>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} by {blog.author}
          </Link>
        </div>
      ))}
    </Stack>
  )
}

export default BlogList
