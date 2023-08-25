describe('Blog app', function() {
  beforeEach(async function() {
    await cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('username').should('exist')
    cy.contains('password').should('exist')
    cy.contains('log in').should('exist')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', async function() {
      const user = {
        name: 'Matti',
        username: 'kayttaja',
        password: 'silisini'
      }

      await cy.request({
        method: 'POST',
        url: 'http://localhost:3003/api/users',
        body: user
      })

      cy.get('input:first').type('kayttaja')
      cy.get('input:last').type('silisini')
      cy.contains('log in').click()

      cy.contains('blogs')


    })

    it('fails with wrong credentials', async function() {
      const user = {
        name: 'Matti',
        username: 'kayttaja',
        password: 'silisini'
      }

      await cy.request({
        method: 'POST',
        url: 'http://localhost:3003/api/users',
        body: user
      })

      cy.get('input:first').type('kayttaja')
      cy.get('input:last').type('silisana')
      cy.contains('log in').click()

      cy.contains('log in to application')


    })
  })


  describe('When logged in', function() {
    beforeEach(async function() {
      const user = {
        name: 'Matti',
        username: 'kayttaja',
        password: 'silisini'
      }

      await cy.request({
        method: 'POST',
        url: 'http://localhost:3003/api/users',
        body: user
      })

      cy.get('input:first').type('kayttaja')
      cy.get('input:last').type('silisini')
      cy.contains('log in').click()

      cy.contains('blogs')

    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()


      cy.get('input:first').type('jtnjtn')
      cy.get('input:second').type('jokujoku.net')
      cy.get('input:last').type('Matti')
      cy.contains('create').click()

      cy.contains('jtnjtn').should('exist')

    })

    it('A blog can be liked', function() {
      cy.contains('new blog').click()


      cy.get('input:first').type('jtnjtn')
      cy.get(':nth-child(2) > input').type('jokujoku.net')
      cy.get('input:last').type('Matti')
      cy.contains('create').click()

      cy.contains('view').click()

      cy.contains('likes: 0')
      cy.contains('like').click()

      cy.contains('likes: 1').should('exist')

    })

    it('A blog can be deleted', function() {
      cy.contains('new blog').click()

      cy.get('input:first').type('jtnjtn')
      cy.get('input:second').type('jokujoku.net')
      cy.get('input:last').type('Matti')
      cy.contains('create').click()

      cy.contains('view').click()

      cy.contains('remove').click()

      cy.contains('jtnjtn').should('not.exist')

    })

    it('only creator can see remove button', async function() {
      cy.contains('new blog').click()

      cy.get('input:first').type('jtnjtn')
      cy.get(':nth-child(2) > input').type('jokujoku.net')
      cy.get('input:last').type('Matti')
      cy.contains('create').click()


      await cy.request('POST', 'http://localhost:3003/api/users', {
        name: 'Miikka', username: 'mluukkai', password: 'salainen'
      })

      const response = await cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'mluukkai', password: 'salainen'
      })

      localStorage.setItem('loggedNoteappUser', JSON.stringify(response.body))
      cy.visit('http://localhost:5173')

      cy.contains('view').click()

      cy.contains('remove').should('not.exist')


    })


    it('Blogs are ordered by likes', function() {
      cy.contains('new blog').click()
      cy.get('input:first').type('most likes')
      cy.get(':nth-child(2) > input').type('firsturl.net')
      cy.get('input:last').type('auth1')
      cy.contains('create').click()

      cy.contains('view').click()
      cy.contains('like').click()
      cy.contains('like').click()

      cy.contains('new blog').click()
      cy.get('input:first').type('close second')
      cy.get(':nth-child(2) > input').type('secondurl.net')
      cy.get('input:last').type('auth2')
      cy.contains('create').click()

      cy.contains('view').click()
      cy.contains('like').click()

      cy.contains('new blog').click()
      cy.get('input:first').type('dead last')
      cy.get(':nth-child(2) > input').type('thirdurl.net')
      cy.get('input:last').type('atuh3')
      cy.contains('create').click()

      cy.get('.blog').eq(0).should('contain', 'most likes')
      cy.get('.blog').eq(1).should('contain', 'close second')
      cy.get('.blog').eq(2).should('contain', 'dead last')
    })

  })

})