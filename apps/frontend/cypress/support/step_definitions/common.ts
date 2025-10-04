import { AfterAll, BeforeAll, Given, Then } from '@badeball/cypress-cucumber-preprocessor'

Given('I am logged in as {string}', (email: string) => {
  cy.login(email)
})

Then('I click logout button', () => {
  cy.get('[data-cy="logout"]').click()
})

Then('I click button named {string}', (btn_name: string) => {
  cy.get(`[data-cy="${btn_name}"]`).click()
})

Then('I change input {string} value to {string}', (label: string, value: string) => {
  cy.get(`[data-cy="input-${label}"]`).clear().type(value)
})

Then('I click submit button', () => {
  cy.get('[data-cy="submit"]').click()
})

Then('I click dropdown menu', () => {
  cy.get('[data-cy="dropdown-menu"]').click()
})

Then('I should see {string}', (text: string) => {
  cy.contains(text, { timeout: 10000 }).should('be.visible')
})

Then('I should wait for {int} seconds', (seconds: number) => {
  cy.wait(seconds * 1000);
});

BeforeAll(() => {
  cy.task('db:seed')
})

AfterAll(() => {
  cy.task('db:clean')
})
