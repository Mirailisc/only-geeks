import { Given } from '@badeball/cypress-cucumber-preprocessor'

Given('I visit the landing page', () => {
  cy.visit('/')
})
