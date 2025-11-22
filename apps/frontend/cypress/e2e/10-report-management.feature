Feature: Report Management
    
    Scenario: View My Reports
        # Login as user user
        Given I am logged in as "user@test.com"
        Then I view settings
        Then I change input "bio" value to "Hey!"
        Then I change input "username" value to "imtest"
        Then I click submit button
        Then I should wait for 1 seconds
        Then I view my profile page at "imtest"
    
        # Create new project
        Then I should wait for 2 seconds
        Then I click button named "create-dropdown-menu"
        Then I should wait for 2 seconds
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

        # Jane report project of user
        Given I am logged in as "janedoe@gmail.com"
        Then I view settings
        Then I change input "bio" value to "Hi Jane!"
        Then I change input "username" value to "janetest"
        Then I click submit button
        Then I should wait for 1 seconds
        Then I view a profile page at "imtest"
        Then I should wait for 2 seconds
        Then I click button named "projects-tab"
        Then I click button named "report-project-button"
        Then I click button named "report-category-selector"
        Then I click button named "report-reason-INAPPROPRIATE_CONTENT"
        Then I change input "report-reason" value to "this is test report of project"
        Then I should wait for 2 seconds
        Then I click button named "submit-report-button"
        Then I should wait for 2 seconds
        Then I should see "Report submitted successfully."
        Then I should wait for 2 seconds
        Then I click button named "report-project-button"
        Then I should wait for 2 seconds
        Then I should see "You have already reported this project."

        # Jane view their reports
        Then I click dropdown menu
        Then I should wait for 1 seconds
        Then I click button named "my-reports-link"
        Then I should wait for 2 seconds
        Then I click button named "my-report-button"
        Then I should see "INAPPROPRIATE_CONTENT"
        Then I should see "testname"
        Then I should see "by @imtest"

    Scenario: Admin View Reports
        Given I am logged in as "admin@test.com"
        When I navigate to "/admin" page
        Then I should see "Admin Dashboard"
        Then I click button named "admin-reports-button"
        Then I should see "INAPPROPRIATE_CONTENT"
        Then I should see "Reporter: janetest"
        Then I should see "Reason: this is test report of project"
    
    Scenario: Admin: Request Edit
        Given I am logged in as "admin@test.com"
        When I navigate to "/admin" page
        Then I should see "Admin Dashboard"
        Then I click button named "admin-reports-button"
        Then I click first button named "report-take-action-button"
        Then I click button named "report-action-select-button"
        Then I should wait for 2 seconds
        Then I click button named "report-action-select-REQUEST_EDIT"
        Then I change input "report-decision-note" value to "this is test note for decision request edit"
        Then I should wait for 4 seconds
        Then I click button named "report-submit-decision-button"

        Given I am logged in as "user@test.com"
        Then I view my profile page at "imtest"
        Then I click button named "projects-tab"
        Then I should see "Admin request to edit this project"

    Scenario: View My Warnings
        Given I am logged in as "user@test.com"
        Then I view settings
        Then I should wait for 2 seconds
        Then I click dropdown menu
        Then I should wait for 1 seconds
        Then I click button named "my-reports-link"
        Then I should wait for 2 seconds
        Then I click button named "my-warning-button"
        Then I should wait for 2 seconds
        Then I should see "INAPPROPRIATE_CONTENT"
        Then I should see "testname"
        Then I should see "REQUEST_EDIT"
        Then I should see "this is test report of project"
        Then I should see "this is test note for decision request edit"

    Scenario: Admin: Unpublish
        Given I am logged in as "admin@test.com"
        When I navigate to "/admin" page
        Then I should see "Admin Dashboard"
        Then I click button named "admin-reports-button"
        Then I click first button named "report-take-action-button"
        Then I click button named "report-action-select-button"
        Then I should wait for 2 seconds
        Then I click button named "report-action-select-UNPUBLISH"
        Then I change input "report-decision-note" value to "this is test note for decision unpublish"
        Then I should wait for 2 seconds
        Then I click button named "report-submit-decision-button"

        Given I am logged in as "user@test.com"
        Then I view my profile page at "imtest"
        Then I click button named "projects-tab"
        Then I should see "Admin request to unpublish this project"

    # Scenario: Admin: Reject Report
        Given I am logged in as "admin@test.com"
        When I navigate to "/admin" page
        Then I should see "Admin Dashboard"
        Then I click button named "admin-reports-button"
        Then I should wait for 2 seconds
        Then I click first button named "report-change-status-button"
        Then I should wait for 2 seconds
        Then I click button named "report-change-status-REJECTED"
        Then I should wait for 2 seconds
        Then I should see "REJECTED"

        Given I am logged in as "janedoe@gmail.com"
        Then I click dropdown menu
        Then I should wait for 1 seconds
        Then I click button named "my-reports-link"
        Then I should wait for 2 seconds
        Then I click button named "my-report-button"
        Then I should see "INAPPROPRIATE_CONTENT"
        Then I should see "testname"
        Then I should see "by @imtest"
        Then I should see "REJECTED"