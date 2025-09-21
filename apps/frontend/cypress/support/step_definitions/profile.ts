import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then('I view my profile', () => {
    cy.visit('/profile')
})