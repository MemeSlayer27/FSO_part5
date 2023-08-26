import { useState } from 'react'
import blogService from '../services/blogs'


const Blog = ({ blog, deletePost, likePost = null, showRemove = false }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [showMore, setShowMore] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const likeHandler = async () => {


    try {
      await blogService.likeBlog(blog)
      setLikes(likes + 1)

      if (likePost) {
        likePost()
      }
    } catch (e) {
      console.log(e)
    }


  }


  if (showMore) {

    return (
      <div style={blogStyle}>
        <div>{blog.title} by {blog.author} <button onClick={() => setShowMore(!showMore)}>hide</button></div>
        <div>{blog.url}</div>
        <div>likes {likes} <button onClick={likeHandler}>like</button></div>
        <div>{blog.user.name}</div>
        {showRemove ? <button onClick={deletePost}>remove</button> : <></>}
      </div>
    )
  }

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} by {blog.author} <button onClick={() => setShowMore(!showMore)}>view</button>
    </div>
  )

}

export default Blog