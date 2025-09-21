Cypress.Commands.add('login', (email: string = 'test@example.com') => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:4000/auth/test-login',
    body: { email },
  })
})
