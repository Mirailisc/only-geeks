Feature: Navbar Search

    Scenario: Search Suggestion
        Given I am logged in as "user@test.com"
        Then I view settings
        Then I change input "bio" value to "Hey!"
        Then I change input "username" value to "imtest"
        Then I click submit button
        
        Then I change input "navbar-search" value to "imtest"
        Then I should see "Profiles"
        Then I should see "@imtest"

    Scenario: Search Profile
        Given I am logged in as "user@test.com"
        Then I view settings
        Then I change input "bio" value to "Hey!"
        Then I change input "username" value to "imtest"
        Then I click submit button
        
        Then I change input "navbar-search" value to "imtest{enter}"
        Then I should see "Found 1 results for “imtest”"
        Then I should see "Hey!"
        Then I should see "@imtest"
