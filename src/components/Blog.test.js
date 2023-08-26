import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders correct content', () => {
  const blog = {
    id: 'lhfalksjdjfhdfhlaskdfa',
    user: {
      id: 'lksadjhflsfyuew',
      name: 'Matti',
      username: 'ree'
    },
    title: 'Component testing is done with react-testing-library',
    url: 'reeee',
    author: 'john',
    likes: 0
  }

  render(<Blog blog={blog} deletePost={() => {}}/>)

  const findTitle = screen.getByText('Component testing is done with react-testing-library by john')
  const findURL = screen.queryByText('reeee')
  const findLikes = screen.queryByText('likes 0')

  expect(findTitle).toBeDefined()
  expect(findURL).toBeNull()
  expect(findLikes).toBeNull()

})


test('clicking the button calls event handler once', async () => {
  const blog = {
    id: 'lhfalksjdjfhdfhlaskdfa',
    user: {
      id: 'lksadjhflsfyuew',
      name: 'Matti',
      username: 'ree'
    },
    title: 'Component testing is done with react-testing-library',
    url: 'reeee',
    author: 'john',
    likes: 0
  }


  render(<Blog blog={blog} deletePost={() => {}}/>)



  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const findURL = screen.getByText('reeee')
  const findLikes = screen.getByText('likes 0')

  expect(findURL).toBeDefined()
  expect(findLikes).toBeDefined()
})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    id: 'lhfalksjdjfhdfhlaskdfa',
    user: {
      id: 'lksadjhflsfyuew',
      name: 'Matti',
      username: 'ree'
    },
    title: 'Component testing is done with react-testing-library',
    url: 'reeee',
    author: 'john',
    likes: 0
  }


  const mockHandler = jest.fn()

  render(<Blog blog={blog} deletePost={() => {}} likePost={mockHandler}/>)

  const viewButton = screen.getByText('view')

  const user = userEvent.setup()
  await user.click(viewButton)

  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)


  expect(mockHandler.mock.calls).toHaveLength(2)
})

