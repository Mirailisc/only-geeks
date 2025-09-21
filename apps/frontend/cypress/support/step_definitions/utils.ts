import { Then } from "@badeball/cypress-cucumber-preprocessor"

Then('I should see {string}', (text: string) => {
  cy.contains(text).should('be.visible')
})
