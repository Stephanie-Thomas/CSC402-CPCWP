# SendGrid Email Verification Implementation Guide

## Overview

This guide outlines how to implement email verification using SendGrid in a user signup flow. The process will:

1.  Collect user registration information
2.  Generate a verification code
3.  Send the code via SendGrid to the user's email
4.  Verify the code entered by the user
5.  Complete the registration process

## 1. Setting up SendGrid

### Create a SendGrid Account

1.  Go to [SendGrid's website](https://sendgrid.com/) and sign up for an account
2.  Verify your domain or use Single Sender Verification for testing

### Obtain API Key

1.  Navigate to Settings → API Keys in your SendGrid dashboard
2.  Click "Create API Key"
3.  **IMPORTANT:** Copy and store your API key securely. It will only be shown once.

### Set Up Sender Authentication

1.  In SendGrid, go to Settings → Sender Authentication
2.  Either verify your domain (recommended for production) or create a Single Sender Verification
3.  Follow the steps provided by SendGrid to complete the authentication process

## 2. Backend Implementation

### Environment Setup

1.  Store your SendGrid API key in the project's .env file
2.  Never hardcode API keys in your source code or include them in repositories

### Dependencies

Include SendGrid's library for your backend language:

-   **Node.js**: `@sendgrid/mail`

In the project terminal:
`cd backend-node`
`npm install @sendgrid/mail`

### Email Verification Flow

#### Generate Verification Code

1.  Generate a secure random code (typically 6-8 digits)
```
// Pseudocode for generating verification code
function generateVerificationCode() {
    return randomDigits(6); // Generate 6 random digits
}
```
#### Step 2: Send Verification Email with SendGrid

1.  Create an email template with:
    -   Clear subject line (e.g., "Verify your account")
    -   WCU Programming Club branding
    -   Verification code

2.  Use SendGrid's API to send the email

#### Step 3: Handle Verification

1.  Modify the current dropdown menu in `frontend/client/src/components/navbar.tsx` to prompt a user for a verification code
2.  Validate the entered code against the stored code
3.  Implement expiration logic (typically 10-30 minutes)


#### Step 4: Complete Registration

1.  If verification succeeds:
    -   Allow user information to be entered into the database
2.  If verification fails:
    -   Allow for code resend with rate limiting

## 3. Implementation Example

### Email Sending Logic

```
// This is a conceptual example, not actual code
function sendVerificationEmail(email, code) {
    // Initialize SendGrid with API key from environment variables
    const sgClient = initializeSendGridClient(API_KEY);
    
    // Compose email
    const message = {
        to: email,
        from: 'verification@yourcompany.com', // Must be verified sender
        subject: 'Your Verification Code',
        text: `Your verification code is: ${code}. This code will expire in 15 minutes.`,
        html: `<p>Your verification code is: <strong>${code}</strong></p>
               <p>This code will expire in 15 minutes.</p>`
    };
    
    // Send email
    try {
        sgClient.send(message);
        return true;
    } catch (error) {
        logError(error);
        return false;
    }
}

```

### Verification Process

```
// This is a conceptual example, not actual code
function verifyCode(email, enteredCode) {
    // Retrieve stored code from database
    const storedData = database.getVerificationData(email);
    
    // Check if code exists and hasn't expired
    if (!storedData || isExpired(storedData.timestamp)) {
        return {
            success: false,
            message: 'Verification code expired or invalid'
        };
    }
    
    // Compare codes
    if (storedData.code === enteredCode) {
        // Mark as verified in database
        database.updateUserStatus(email, 'verified');
        return {
            success: true,
            message: 'Email verified successfully'
        };
    } else {
        return {
            success: false,
            message: 'Invalid verification code'
        };
    }
}

```

# Alumni Signup Implementation

## Existing Infrastructure

-   An existing route `/signup` is already present in the project files specifically for alumni signups
-   This endpoint currently collects alumni information but lacks email verification

## Implementation Steps

### 1. Update Navigation

-   Modify the dropdown menu in the navbar
-   Change the hyperlink destination to redirect to `/signup`
    

### 2. Modify SendGrid Implementation

While the main SendGrid guide focuses on user verification, for this alumni use case, you will:

1.  Configure SendGrid to send notifications to club officers instead of verification codes to users
2.  Include all form submission data in the email to officers
3.  Skip the verification code entry step since this is an officer notification scenario

### 3. Email Content Modifications

The email sent through SendGrid should:

-   Have a clear subject line (e.g., "New Alumni Signup Submission")
-   Include all information submitted in the alumni form
-   Format the data in a readable way for officers to review
-   Potentially include action buttons/links for officers to approve/reject the submission

### 5. Backend Adjustments

-   Modify the `/signup` route handler to:
    1.  Process the form submission as normal
    2.  Use SendGrid to email club officers with the submitted information

### 6. Officer Configuration

-   Maintain a list of officer emails in your environment configuration
-   Consider implementing officer roles/permissions if different officers need different notifications
