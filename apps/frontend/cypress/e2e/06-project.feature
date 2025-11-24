Feature: Project management

    Background:
        Given I am logged in as "user@test.com"
        Then I view settings
        Then I change input "bio" value to "Hey!"
        Then I change input "username" value to "imtest"
        Then I click submit button
        Then I view my profile
        Then I click button named "projects-tab"

    Scenario: Create Project
        Then I click button named "create-dropdown-menu"
        Then I should see "Create New"
        Then I should see "Project"
        Then I click button named "create-project-dropdown-item"
        Then I should see "Create your new project"
        Then I change input "title" value to "testname"
        Then I change input "description" value to "testDescription"
        Then I click submit button
        Then I click button named "projects-tab"
        Then I should see "testname"
        Then I should see "testDescription"
        Then I should see "Edit"
        Then I should see "Delete"

    Scenario: Edit Project
        Then I click button named "edit-project-button"
        Then I should see "Edit your project"
        Then I should see "testname" in the "title" input
        Then I should see "testDescription" in the "description" textarea
        Then I change input "link" value to "https://youtu.be/dQw4w9WgXcQ?si=_8xYN3aI3Izp4zAE"
        Then I change input "startDate" value to "2023-01-12"
        Then I change input "endDate" value to "2024-01-12"
        Then I click submit button
        Then I click button named "projects-tab"
        Then I should see button named "project-link-button" enabled
        Then I should see "12/01/2023"
        Then I should see "12/01/2024"

    Scenario: Delete Project
        Then I click button named "delete-project-button"
        Then I should see "Are you sure you want to delete this project?"
        Then I click button named "confirm-delete-project-button"
        Then I should not see "testname"
        Then I should not see "testdescription"


