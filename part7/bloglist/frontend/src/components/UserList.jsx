import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'

const UserList = () => {
  const result = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  if (result.isLoading) {
    return <p>Loading...</p>
  }

  const users = result.data
  const byBlogs = (a, b) => b.blogs.length - a.blogs.length

  return (
    <div>
      <h2>Users</h2>
      <table>
        <tr>
          <th></th>
          <th>blogs created</th>
        </tr>
        {[...users].sort(byBlogs).map((user) => (
          <tr>
            <td>{user.name}</td>
            <td>{user.blogs.length}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}

export default UserList
