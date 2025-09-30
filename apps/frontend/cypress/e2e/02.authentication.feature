Feature: Authentication

  Scenario: View Profile
    Given I am logged in as "user@test.com"
    Then I view my profile
    Then I should see "user@test.com"

  Scenario: Admin Login
    Given I am logged in as "admin@test.com"
    Then I view my profile
    Then I should see "You are an admin"

  Scenario: Logout
    Given I am logged in as "user@test.com"
    Then I view my profile
    Then I click dropdown menu
    Then I click logout button
    Then I should see "Hello World!"