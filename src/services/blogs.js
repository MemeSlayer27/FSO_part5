import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'


let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.get(baseUrl, config)
  return response.data
}

const create = (blog) => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.post(baseUrl, blog, config)
  return request.then(response => response.data)
}


const likeBlog = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }


  const updatedBlog = { ...blog, likes: blog.likes + 1 }
  const response = await axios.put(`${baseUrl}/${blog.id}`, updatedBlog, config)
  return response.data

}


const deleteBlog = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${blog.id}`, config)
  return response.data
}

export default { getAll, setToken, create, likeBlog, deleteBlog }