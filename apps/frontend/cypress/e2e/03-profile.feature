Feature: Profile

    Scenario: View My Profile
        Given I am logged in as "user@test.com"
        Then I view my profile
        Then I should see "user@test.com"

    Scenario: Edit My Profile
        Given I am logged in as "user@test.com"
        Then I view settings
        Then I change input "bio" value to "Hey!"
        Then I change input "username" value to "imtest"
        Then I click submit button
        Then I view my profile page at "imtest"
        Then I should see "Hey!"
        Then I view my profile
        Then I should see "Hey!"
    
    Scenario: View projects
        Given I am logged in as "user@test.com"
        Then I view my profile
        Then I click button named "projects-tab"
        Then I should see "Projects"
        Then I should see "Add new"
        Then I click button named "blogs-tab"
        Then I should see "Blogs"
        Then I should see "Write blog"
        Then I click button named "portfolio-tab"
        Then I should see "Education"
        Then I should see "Achievements"
        Then I should see button named "add-education-button"
        Then I should see button named "add-achievement-button"