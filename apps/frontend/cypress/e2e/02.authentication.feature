Feature: Authentication

  Scenario: View Profile
    Given I am logged in as "user@test.com"
    Then I view my profile
    Then I should see "user@test.com"

  Scenario: Admin Login
    Given I am logged in as "admin@test.com"
    Then I view settings
    Then I should see "Now you login as an Admin, So be careful with the changes you make."

  Scenario: Logout
    Given I am logged in as "user@test.com"
    Then I view my profile
    Then I should wait for 5 seconds
    Then I click dropdown menu
    Then I click logout button
    Then I should see "Welcome back"