describe('Blog app', function() {
  beforeEach( function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('username').should('exist')
    cy.contains('password').should('exist')
    cy.contains('login').should('exist')
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
      cy.contains('login').click()

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
      cy.contains('login').click()

      cy.contains('login to application')


    })
  })


  describe('When logged in', function() {
    beforeEach( function() {
      const user = {
        name: 'Matti',
        username: 'kayttaja',
        password: 'silisini'
      }

      cy.request({
        method: 'POST',
        url: 'http://localhost:3003/api/users',
        body: user
      })

      cy.get('input:first').type('kayttaja')
      cy.get('input:last').type('silisini')
      cy.contains('login').click()

      cy.contains('blogs')

    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()


      cy.get('input:first').type('jtnjtn')
      cy.get(':nth-child(2) > input').type('jokujoku.net')
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

      cy.contains('likes 0')
      cy.contains('like').click()

      cy.contains('likes 1').should('exist')

    })

    it('A blog can be deleted', function() {
      cy.contains('new blog').click()

      cy.on('window:confirm', (str) => {
        return true
      })

      cy.get('input:first').type('jtnjtn')
      cy.get(':nth-child(2) > input').type('jokujoku.net')
      cy.get('input:last').type('Matti')
      cy.contains('create').click()

      cy.contains('view').click()

      cy.contains('remove').click()

      cy.contains('jtnjtn').should('not.exist')

    })

    it('only creator can see remove button', function() {
      cy.contains('new blog').click()

      cy.get('input:first').type('jtnjtn')
      cy.get(':nth-child(2) > input').type('jokujoku.net')
      cy.get('input:last').type('Matti')
      cy.contains('create').click()


      cy.request('POST', 'http://localhost:3003/api/users', {
        name: 'Miikka', username: 'mluukkai', password: 'salainen'
      })

      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'mluukkai', password: 'salainen'
      }).then(response => {

        cy.visit('http://localhost:5173')

        cy.get('input:first').type('mluukkai')
        cy.get('input:last').type('salainen')
        cy.contains('login').click()

        cy.contains('blogs')

        cy.contains('view').click()

        cy.contains('remove').should('not.exist')
      })



    })


    it('Blogs are ordered by likes', function() {
      cy.contains('new blog').click()
      cy.get('input:first').should('be.visible').type('most likes')
      cy.get(':nth-child(2) > input').should('be.visible').type('auth1')
      cy.get('input:last').should('be.visible').type('firsturl.net')
      cy.contains('create').click()

      cy.contains('view').last().click()
      cy.contains('like').click()
      cy.contains('like').click()
      cy.contains('hide').click()

      cy.wait(2000)


      cy.contains('new blog').should('be.visible').click()
      cy.get('input:first').should('be.visible').type('close second')
      cy.get(':nth-child(2) > input').should('be.visible').type('auth2')
      cy.get('input:last').should('be.visible').type('secondurl.net')
      cy.contains('create').click()

      cy.contains('view').last().click()
      cy.contains('like').click()
      cy.contains('hide').click()

      cy.wait(2000)

      cy.contains('new blog').should('be.visible').click()
      cy.get('input:first').should('be.visible').type('dead last')
      cy.get(':nth-child(2) > input').should('be.visible').type('auth3')
      cy.get('input:last').should('be.visible').type('thirdurl.net')
      cy.contains('create').click()

      cy.wait(2000)

      cy.get('.blog').eq(0).should('contain', 'most likes')
      cy.get('.blog').eq(1).should('contain', 'close second')
      cy.get('.blog').eq(2).should('contain', 'dead last')
    })


  })

})