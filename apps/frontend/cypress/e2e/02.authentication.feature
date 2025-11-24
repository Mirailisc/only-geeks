Feature: Authentication

  Scenario: View Profile
    Given I am logged in as "user@test.com"
    Then I view my profile
    Then I should see "user@test.com"

  Scenario: Admin Login
    Given I am logged in as "admin@test.com"
    Then I view settings
    Then I should see "Now you login as an Admin, So be careful with the changes you make."

  Scenario: Logout
    Given I am logged in as "user@test.com"
    Then I view my profile
    Then I should wait for 3 seconds
    Then I click dropdown menu
    Then I click logout button
    Then I should see "Welcome back"
  
  Scenario: Create an account
    Given I visit the landing page
    Then I should wait for 3 seconds
    Then I click button named "noauth-dropdown-menu"
    Then I click button named "login"
    Then I should wait for 1 seconds
    Then I click button named "tabs-register"
    Then I change input "register-firstName" value to "John"
    Then I change input "register-lastName" value to "Doe"
    Then I change input "register-email" value to "johndoe@gmail.com"
    Then I change input "register-username" value to "johndoe1"
    Then I change input "register-password" value to "Johndoe@Password1"
    Then I change input "register-confirmPassword" value to "Johndoe@Password1"
    Then I click button named "button-register"
    Then I should wait for 2 seconds
    Then I view my profile
    Then I should see "@johndoe1"

    Then I should wait for 2 seconds
    Then I click dropdown menu
    Then I click logout button
    Then I should see "Welcome back"
  
  Scenario: Login to existed account
    Given I visit the landing page
    Then I should wait for 3 seconds
    Then I click button named "noauth-dropdown-menu"
    Then I click button named "login"
    Then I change input "login-username" value to "johndoe1"
    Then I change input "login-password" value to "Johndoe@Password1"
    Then I click button named "button-login"
    Then I should wait for 2 seconds
    Then I view my profile
    Then I should wait for 1 seconds
    Then I should see "@johndoe1"

    Then I should wait for 2 seconds
    Then I click dropdown menu
    Then I click logout button
    Then I should see "Welcome back"

  Scenario: Failed Login
    Given I visit the landing page
    Then I should wait for 3 seconds
    Then I click button named "noauth-dropdown-menu"
    Then I click button named "login"
    Then I change input "login-username" value to "johndoe1"
    Then I change input "login-password" value to "wrongpasswordishere"
    Then I click button named "button-login"
    Then I should wait for 2 seconds
    Then I should see "Username or password is incorrect"

  Scenario: User access admin dashboard
    Given I am logged in as "user@test.com"
    When I navigate to "/admin" page
    Then I should see "Access Denied!"
    Then I should see "You must be an admin to access the admin page."
  
  Scenario: admin access admin dashboard
    Given I am logged in as "admin@test.com"
    When I navigate to "/admin" page
    Then I should see "Admin Dashboard"
    
    Then I view my profile
    Then I should wait for 2 seconds
    Then I click dropdown menu
    Then I should wait for 1 seconds
    Then I click button named "admin-dashboard-link"
    Then I should see "Admin Dashboard"
