describe('Login page exists', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/login')
  })
})