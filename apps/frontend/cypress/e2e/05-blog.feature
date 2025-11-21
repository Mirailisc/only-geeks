Feature: Blog management

    Background: 
        Given I am logged in as "user@test.com"
        Then I view settings
        Then I change input "bio" value to "Hey!"
        Then I change input "username" value to "imtest"
        Then I click submit button
        Then I should wait for 2 seconds

    Scenario: Create blog (Draft mode)
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
        Then I change editor input "editor-content-editable" value to "# test H1{enter}## test H2{enter}### testH3{enter}#testHashtag"
        Then I should wait for 1 seconds
        Then I change input "blog-title" value to "this is test blog"
        Then I should see "this is test blog" in the "blog-title" input
        Then I click button named "blog-submit-button"
        Then I should see "Publish Blog"
        Then I should see "Choose the visibility for your blog post"
        Then I click button named "vis-draft-mode"
        Then I click button named "blog-publish-button"
        Then I should see "Success"
        Then I should see "Your blog has been saved as draft successfully."
        Then I view my profile page at "imtest"
        Then I click button named "blogs-tab"
        Then I should see "this is test blog"
        Then I should see "Draft"
        Then I should wait for 2 seconds

    Scenario: Edit Draft Blog
        Then I view my profile page at "imtest"
        Then I click button named "blogs-tab"
        Then I should see "this is test blog"
        Then I should see "Draft"
        Then I click button named "edit-blog-button"
        Then I change editor input "editor-content-editable" value to "#testHashtag2"
        Then I should wait for 2 seconds
        Then I click button named "blog-submit-button"
        Then I should see "Publish Blog"
        Then I should see "Choose the visibility for your blog post"
        Then I click button named "vis-draft-mode"
        Then I click button named "blog-publish-button"
        Then I should see "Success"
        Then I should see "Your blog has been saved as draft successfully."
        Then I should wait for 1 seconds
        Then I view my profile page at "imtest"
        Then I click button named "blogs-tab"
        Then I should see "this is test blog"
        Then I should see "#testHashtag2"
        Then I should see "Draft"
        Then I should wait for 2 seconds

    Scenario: Convert to Publish Blog
        Then I view my profile page at "imtest"
        Then I click button named "blogs-tab"
        Then I should see "this is test blog"
        Then I should see "Draft"
        Then I click button named "edit-blog-button"
        Then I change editor input "editor-content-editable" value to "#testHashtag2"
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
        Then I should wait for 2 seconds

    Scenario: Read Blog
        Then I view my profile page at "imtest"
        Then I click button named "blogs-tab"
        Then I should see "this is test blog"
        Then I should see "Published"
        Then I click button named "view-blog-button"
        Then I should see "1 min read"
        Then I should see "this is test blog"
        Then I should see "Published"
        Then I should see "User User"
        Then I should see "@imtest"
        Then I should see "#testHashtag2"
        Then I should wait for 2 seconds

    Scenario: Delete blog
        Then I view my profile page at "imtest"
        Then I click button named "blogs-tab"
        Then I click button named "delete-blog-button"
        Then I click button named "confirm-delete-blog-button"
        Then I should see "No Blog yet"
        Then I should see "Write new blog"
