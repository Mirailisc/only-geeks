Feature: Portfolio management

    Background:
        Given I am logged in as "user@test.com"
        Then I view settings
        Then I change input "bio" value to "Hey!"
        Then I change input "username" value to "imtest"
        Then I click submit button
        Then I view my profile
        Then I click button named "portfolio-tab"
        
    Scenario: Create Portfolio
        Then I should see button named "add-education-button"
        Then I should see button named "add-achievement-button"
        Then I click button named "add-education-button"
        Then I should see "Create Education"
        Then I change input "school" value to "testSchool"
        Then I change input "startDate" value to "2023-01-12"
        Then I change input "endDate" value to "2024-01-12"
        Then I click submit button
        Then I click button named "portfolio-tab"
        Then I should see "testSchool"
        Then I should see "12/01/2023"
        Then I should see "12/01/2024"

        Then I click button named "add-achievement-button"
        Then I should see "Create Achievement"
        Then I change input "title" value to "testTitle"
        Then I change input "issuer" value to "testIssuer"
        Then I change input "date" value to "2023-01-12"
        Then I click submit button
        Then I click button named "portfolio-tab"
        Then I should see "testTitle"
        Then I should see "testIssuer"
        Then I should see "12/01/2023"

        Then I should see "Add new"
        Then I should see "Edit"
        Then I should see "Delete"

    Scenario: Edit Portfolio
        Then I click button named "edit-education-button"
        Then I should see "testSchool" in the "school" input
        Then I should see "2023-01-12" in the "startDate" input
        Then I should see "2024-01-12" in the "endDate" input
        Then I change input "degree" value to "Bachelor of Internet"
        Then I change input "fieldOfStudy" value to "Severe Internet"
        Then I click submit button
        Then I should see "Bachelor of Internet"
        Then I should see "Severe Internet"

        Then I click button named "edit-achievement-button"
        Then I should see "testTitle" in the "title" input
        Then I should see "testIssuer" in the "issuer" input
        Then I should see "2023-01-12" in the "date" input
        Then I change input "description" value to "testDescription"
        Then I click submit button
        Then I should see "testDescription"

    Scenario: Delete Portfolio
        Then I click button named "delete-education-button"
        Then I should see "Are you sure you want to delete this education?"
        Then I click button named "confirm-delete-education-button"
        Then I should not see "testSchool"
        Then I should not see "Bachelor of Internet"
        Then I should see button named "add-education-button"

        Then I click button named "delete-achievement-button"
        Then I should see "Are you sure you want to delete this achievement?"
        Then I click button named "confirm-delete-achievement-button"
        Then I should not see "testTitle"
        Then I should not see "testIssuer"
        Then I should not see "testDescription"
        Then I should see button named "add-achievement-button"