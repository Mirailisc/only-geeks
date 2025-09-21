import { Given, Then } from '@badeball/cypress-cucumber-preprocessor'

Given('I am logged in as {string}', (email: string) => {
  cy.login(email)
})

Then('I should see {string}', (text: string) => {
  cy.contains(text).should('be.visible')
})
