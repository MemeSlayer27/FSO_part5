import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogCreation from './NewBlogCreation'


test('new blog creation form works', async () => {
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

  render(<NewBlogCreation afterPost={mockHandler} show={true} toggleShow={() => {}} mockCreate={mockHandler} />)

  const titleInput = screen.getAllByRole('textbox')[0]
  const authorInput = screen.getAllByRole('textbox')[1]
  const urlInput = screen.getAllByRole('textbox')[2]
  const createButton = screen.getByText('create')

  await userEvent.type(titleInput, 'Test title')
  await userEvent.type(authorInput, 'Test author')
  await userEvent.type(urlInput, 'Test url')
  await userEvent.click(createButton)

  expect(mockHandler).toHaveBeenCalledTimes(1)
  expect(mockHandler.mock.calls[0][0]).toEqual({
    title: 'Test title',
    author: 'Test author',
    url: 'Test url',
  })

})