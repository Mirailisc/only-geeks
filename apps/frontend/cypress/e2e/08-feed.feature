Feature: Feed
    Scenario: CRUD Feed (Project)
        # Login
        Given I am logged in as "user@test.com"
        Then I view settings
        Then I change input "bio" value to "Hey!"
        Then I change input "username" value to "imtest"
        Then I click submit button
        Then I should wait for 1 seconds

        # Create new project
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

        # View Feed as I'm logged in
        Given I visit the landing page
        Then I should see "testname"
        Then I should see "Project"
        Then I should see "User User"
        Then I should see "@imtest"

        # Logout
        When I view my profile
        Then I should wait for 3 seconds
        When I click dropdown menu
        Then I click logout button
        Then I should see "Welcome back"

        # View Feed as Guest
        Given I visit the landing page
        Then I should see "testname"
        Then I should see "Project"
        Then I should see "User User"
        Then I should see "@imtest"

        # Delete Project
        Given I am logged in as "user@test.com"
        Then I view my profile
        Then I click button named "projects-tab"
        Then I click button named "delete-project-button"
        Then I should see "Are you sure you want to delete this project?"
        Then I click button named "confirm-delete-project-button"
        Then I should not see "testname"
        Then I should not see "testdescription"

    Scenario: Create Achievement
        # Login
        Given I am logged in as "user@test.com"
        Then I view settings
        Then I change input "bio" value to "Hey!"
        Then I change input "username" value to "imtest"
        Then I click submit button
        Then I should wait for 1 seconds

        # Create new Achievement
        When I view my profile
        Then I click button named "portfolio-tab"
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

        # View Feed as I'm logged in
        Given I visit the landing page
        Then I should see "testTitle"
        Then I should see "Issued by testIssuer"
        Then I should see "January 2023"
        Then I should see "Achievement"
        Then I should see "User User"
        Then I should see "@imtest"

        # Logout
        When I view my profile
        Then I should wait for 3 seconds
        When I click dropdown menu
        Then I click logout button
        Then I should see "Welcome back"

        # View Feed as Guest
        Given I visit the landing page
        Then I should see "testTitle"
        Then I should see "Issued by testIssuer"
        Then I should see "January 2023"
        Then I should see "Achievement"
        Then I should see "User User"
        Then I should see "@imtest"

        # Delete Achievement
        Given I am logged in as "user@test.com"
        Then I view my profile
        Then I click button named "portfolio-tab"
        Then I click button named "delete-achievement-button"
        Then I should see "Are you sure you want to delete this achievement?"
        Then I click button named "confirm-delete-achievement-button"
        Then I should not see "testTitle"
        Then I should not see "testIssuer"
        Then I should not see "testDescription"
        Then I should see button named "add-achievement-button"

    Scenario: Create Blog
        # Login
        Given I am logged in as "user@test.com"
        Then I view settings
        Then I change input "bio" value to "Hey!"
        Then I change input "username" value to "imtest"
        Then I click submit button
        Then I should wait for 1 seconds

        # Create new Blog
        Then I click button named "create-dropdown-menu"
        Then I should wait for 1 seconds
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
        Then I view my profile page at "imtest"
        Then I click button named "blogs-tab"
        Then I should see "Published"

        # View Feed as I'm logged in
        Given I visit the landing page
        Then I should see "this is test blog"
        Then I should see "Test Blog creation to view in feed #testHashtag"
        Then I should see "Blog"
        Then I should see "User User"
        Then I should see "@imtest"

        #Logout
        When I view my profile
        Then I should wait for 3 seconds
        When I click dropdown menu
        Then I click logout button
        Then I should see "Welcome back"

        # View Feed as Guest
        Given I visit the landing page
        Then I should see "this is test blog"
        Then I should see "Test Blog creation to view in feed #testHashtag"
        Then I should see "Blog"
        Then I should see "User User"
        Then I should see "@imtest"

        # Delete Blog
        Given I am logged in as "user@test.com"        
        Then I view my profile page at "imtest"
        Then I click button named "blogs-tab"
        Then I click button named "delete-blog-button"
        Then I click button named "confirm-delete-blog-button"
        Then I should see "No Blog yet"
        Then I should see "Write new blog"
        Then I should wait for 2 seconds