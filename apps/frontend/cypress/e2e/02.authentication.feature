Feature: Authentication 

  Scenario: View Profile
    Given I am logged in as "test@example.com"
    Then I view my profile
    Then I should see "test@example.com"