Feature: Report Creation
    Scenario: Report User
        Given I am logged in as "user@test.com"
        Then I view settings
        Then I change input "bio" value to "Hey!"
        Then I change input "username" value to "imtest"
        Then I click submit button
        Then I should wait for 1 seconds
        Then I view the profile page at "imtest"

        Given I am logged in as "janedoe@gmail.com"
        Then I view settings
        Then I change input "bio" value to "Hi Jane!"
        Then I change input "username" value to "janetest"
        Then I click submit button
        Then I should wait for 1 seconds
        Then I view the profile page at "imtest"
        Then I click button named "report-user-button"
        Then I click button named "report-category-selector"
        Then I click button named "report-reason-SPAM"
        Then I change input "report-reason" value to "this is test report of user"
        Then I should wait for 2 seconds
        Then I click button named "submit-report-button"
        Then I should wait for 2 seconds
        Then I should see "Report submitted successfully."
        Then I should wait for 2 seconds
        Then I click button named "report-user-button"
        Then I should wait for 2 seconds
        Then I should see "You have already reported this profile."
        
    Scenario: Report Blog
        # Login as user user
        Given I am logged in as "user@test.com"
        Then I view settings
        Then I change input "bio" value to "Hey!"
        Then I change input "username" value to "imtest"
        Then I click submit button
        Then I should wait for 1 seconds
        Then I view the profile page at "imtest"

        # Blog creation belong with user user
        Then I should wait for 2 seconds
        Then I click button named "create-dropdown-menu"
        Then I should see "Create New"
        Then I should see "Blog"
        Then I click button named "create-blog-dropdown-item"
        Then I should see "Your Blogs"
        Then I should see "Select a draft or published to continue editing or create a new blog"
        Then I click button named "create-new-blog-button"
        Then I should see "Untitled" in the "blog-title" input
        Then I should see "Draft"
        Then I change editor input "editor-content-editable" value to "# Test Blog creation to view in feed #testHashtag"
        Then I should wait for 1 seconds
        Then I change input "blog-title" value to "this is test blog"
        Then I should see "this is test blog" in the "blog-title" input
        Then I click button named "blog-submit-button"
        Then I should see "Publish Blog"
        Then I should see "Choose the visibility for your blog post"
        Then I click button named "vis-published-mode"
        Then I click button named "blog-publish-button"
        Then I should see "Success"
        Then I should see "Your blog has been published successfully."
        Then I view the profile page at "imtest"
        Then I click button named "blogs-tab"
        Then I should see "Published"

        Given I am logged in as "janedoe@gmail.com"
        Then I view settings
        Then I change input "bio" value to "Hi Jane!"
        Then I change input "username" value to "janetest"
        Then I click submit button
        Then I should wait for 1 seconds
        Then I view the profile page at "imtest"
        Then I click button named "blogs-tab"
        Then I click button named "view-blog-button"
        Then I click button named "report-blog-button"
        Then I click button named "report-category-selector"
        Then I click button named "report-reason-INAPPROPRIATE_CONTENT"
        Then I change input "report-reason" value to "this is test report of blog"
        Then I should wait for 2 seconds
        Then I click button named "submit-report-button"
        Then I should wait for 2 seconds
        Then I should see "Report submitted successfully."
        Then I should wait for 2 seconds
        Then I click button named "report-blog-button"
        Then I should wait for 2 seconds
        Then I should see "You have already reported this blog."

    Scenario: Report Project
        # Login as user user
        Given I am logged in as "user@test.com"
        Then I view settings
        Then I change input "bio" value to "Hey!"
        Then I change input "username" value to "imtest"
        Then I click submit button
        Then I should wait for 1 seconds
        Then I view the profile page at "imtest"
    
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

        Given I am logged in as "janedoe@gmail.com"
        Then I view settings
        Then I change input "bio" value to "Hi Jane!"
        Then I change input "username" value to "janetest"
        Then I click submit button
        Then I should wait for 1 seconds
        Then I view the profile page at "imtest"
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
