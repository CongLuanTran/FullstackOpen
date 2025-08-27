import { Link } from 'react-router-dom'
import { useUsers } from '../hooks/useUsers'

const UserList = () => {
  const { data: users, isLoading } = useUsers()

  if (isLoading) {
    return <p>Loading...</p>
  }

  const byBlogs = (a, b) => b.blogs.length - a.blogs.length

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {[...users].sort(byBlogs).map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserList
