import { useState, useEffect } from 'react'
import blogService from '../services/blogs'
import '../index.css'



const NewBlogCreation = ({ afterPost, show, toggleShow, mockCreate = null }) => {


  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleURLChange = (event) => {
    setURL(event.target.value)
  }


  const onCreate = async (event) => {
    event.preventDefault()

    if (mockCreate) {
      return mockCreate({ title, author, url })
    }

    const blogPost = { title, author, url }

    const returnedPost = await blogService.create(blogPost)
    afterPost(returnedPost)

    setTitle('')
    setAuthor('')
    setURL('')

  }

  if (show) {
    return (
      <div>
        <div>title:<input value={title} onChange={handleTitleChange} /></div>
        <div>author:<input value={author} onChange={handleAuthorChange} /></div>
        <div>url:<input value={url} onChange={handleURLChange} /></div>
        <button onClick={onCreate}>create</button>
        <button onClick={toggleShow}>cancel</button>
      </div>
    )
  }

  return (
    <button onClick={toggleShow}>new blog</button>
  )


}


export default NewBlogCreation