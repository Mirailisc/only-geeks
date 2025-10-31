import { Then } from '@badeball/cypress-cucumber-preprocessor'

Then('I view my profile', () => {
  cy.visit('/profile')
})

Then('I view my profile page at {string}', (username: string) => {
  cy.visit(`/user/${username}`)
})

Then('I view settings', () => {
  cy.visit('/settings')
})
