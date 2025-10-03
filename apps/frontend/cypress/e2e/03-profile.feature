Feature: Profile

    Scenario: View My Profile
        Given I am logged in as "user@test.com"
        Then I view my profile
        Then I should see "user@test.com"

    Scenario: Edit My Profile
        Given I am logged in as "user@test.com"
        Then I view my profile
        Then I change input "bio" value to "Hey!"
        Then I change input "username" value to "imtest"
        Then I click submit button
        Then I should see toast with "Profile updated successfully!"
        Then I view my profile page at "imtest"
        Then I should see "Hey!"