import { Given } from '@badeball/cypress-cucumber-preprocessor'

Given('I open the landing page', () => {
  cy.visit('/')
})
