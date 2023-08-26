import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import NewBlogCreation  from './components/NewBlogCreation'
import blogService from './services/blogs'
import loginService from './services/login'
import PropTypes from 'prop-types'
import './index.css'



const App = () => {
  const [blogs, setBlogs] = useState([])

  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [showForm, setForm] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    ).catch(e => console.log('not logged in'))
  }, [])


  const fetchBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs)
  }


  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const onLogin = async (event) => {
    try{
      event.preventDefault()

      const user = await loginService.login(username, password)

      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )

      console.log(user)

      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')

      await fetchBlogs()
    } catch (e) {
      console.log(e)
      displayError('wrong username or password')
    }


  }

  const onLogOut = (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogUser')

    blogService.setToken(null)

    setUser(null)
  }

  const addPost = (post) => {
    setBlogs([...blogs, post])

    displayMessage(`a new blog ${post.title} by ${post.author} added`)

    setForm(!showForm)
  }


  const displayMessage = (message) => {
    setMessage(message)

    setTimeout(() => {
      setMessage(null)
    }, 1000)
  }

  const displayError = (message) => {
    setError(message)

    setTimeout(() => {
      setError(null)
    }, 3000)
  }

  const toggleShowForm = () => setForm(!showForm)

  const deletePost = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.deleteBlog(blog)


      const updatedblogs = blogs.filter( b => b !== blog)

      setBlogs(updatedblogs)
    }

  }


  const likePost = (blog) => {
    const updated = blogs

    const index = updated.indexOf(blog)

    updated[index] = { ...blog, likes: blog + 1 }

    setBlogs(updated)

  }


  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={message} />
        <Error errorMessage={error} />
        <CredentialField text={'username'} currentValue={username} onChange={handleUsernameChange} />
        <CredentialField text={'password'} currentValue={password} onChange={handlePasswordChange} />
        <LoginButton onLogin={onLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <Error errorMessage={error} />
      <div>{user.name} logged in <LogOutButton onLogOut={onLogOut}/></div>
      <NewBlogCreation afterPost={addPost} show={showForm} toggleShow={toggleShowForm} />
      {blogs.sort( (a,b) => b.likes - a.likes).map(blog =>                  // likepost handler needs to change the likes here as well
        <Blog className='blog' key={blog.id} blog={blog} deletePost={() => deletePost(blog)} likePost={() => likePost(blog)} showRemove={user.username === blog.user.username}/>
      )}
    </div>
  )
}

const CredentialField = ({ text, currentValue, onChange }) => {

  return (
    <div>
      <div>{text} <input onChange={onChange} value={currentValue}/></div>
    </div>
  )
}

CredentialField.propTypes = {
  text: PropTypes.string.isRequired,
  currentValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

const LoginButton = ({ onLogin }) => {
  return (
    <button onClick={onLogin}>login</button>
  )
}

const LogOutButton = ({ onLogOut }) => {
  return (
    <button onClick={onLogOut}>logout</button>
  )
}


const Notification = ({ message }) => {

  if (message === null) {
    return null
  }

  return (
    <div className='notification'>
      {message}
    </div>
  )
}


const Error = ({ errorMessage }) => {

  if (errorMessage === null) {
    return null
  }

  return (
    <div className='error'>
      {errorMessage}
    </div>
  )
}

export default App