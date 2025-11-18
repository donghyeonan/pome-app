# Google OAuth Setup Guide

This guide will walk you through setting up Google OAuth credentials for the Pome application.

## Prerequisites

- Google account
- Access to [Google Cloud Console](https://console.cloud.google.com/)

## Step-by-Step Setup

### 1. Create or Select a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top of the page
3. Either:
   - Click **"New Project"** and enter "Pome App" as the project name
   - Or select an existing project

### 2. Enable Google+ API (Required for OAuth)

1. In the Google Cloud Console, go to **"APIs & Services" > "Library"**
2. Search for **"Google+ API"** or **"People API"**
3. Click on it and press **"Enable"**
   - Note: Google+ API is deprecated but still needed for basic OAuth profile access
   - Alternatively, you can use "Google People API" which is the modern replacement

### 3. Configure OAuth Consent Screen

1. Go to **"APIs & Services" > "OAuth consent screen"**
2. Choose **"External"** user type (unless you have Google Workspace)
3. Click **"Create"**
4. Fill in the required information:
   - **App name**: Pome
   - **User support email**: Your email
   - **Developer contact email**: Your email
5. Click **"Save and Continue"**
6. On the **Scopes** page:
   - Click **"Add or Remove Scopes"**
   - Add these scopes:
     - `userinfo.email`
     - `userinfo.profile`
     - `openid`
   - Click **"Update"** then **"Save and Continue"**
7. On **Test users** page:
   - Add your own email for testing
   - Click **"Save and Continue"**
8. Review and click **"Back to Dashboard"**

### 4. Create OAuth 2.0 Credentials

1. Go to **"APIs & Services" > "Credentials"**
2. Click **"+ Create Credentials"** at the top
3. Select **"OAuth client ID"**
4. Choose **"Web application"** as the application type
5. Configure the OAuth client:

   **Name**: Pome App Development

   **Authorized JavaScript origins**:
   - Click **"+ Add URI"**
   - Add: `http://localhost:3000`
   - (For production, add: `https://your-production-domain.com`)

   **Authorized redirect URIs**:
   - Click **"+ Add URI"**
   - Add: `http://localhost:3000/api/auth/callback/google`
   - (For production, add: `https://your-production-domain.com/api/auth/callback/google`)

6. Click **"Create"**

### 5. Copy Your Credentials

After creating the OAuth client, you'll see a popup with:
- **Client ID**: Something like `123456789-abc.apps.googleusercontent.com`
- **Client Secret**: Something like `GOCSPX-abc123xyz`

**Keep these safe!**

### 6. Add Credentials to Your .env File

Open your `.env` file in the project root and add:

```bash
GOOGLE_CLIENT_ID="your-actual-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-actual-client-secret"
```

**Important**: Never commit these credentials to version control!

## Configuration Summary

### Development Environment
- **Authorized Origins**: `http://localhost:3000`
- **Redirect URI**: `http://localhost:3000/api/auth/callback/google`

### Production Environment (When Ready)
- **Authorized Origins**: `https://your-domain.com`
- **Redirect URI**: `https://your-domain.com/api/auth/callback/google`

## Verification

To verify your setup is correct:

1. Check that `.env` file contains both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
2. Verify the redirect URI in Google Console matches exactly: `http://localhost:3000/api/auth/callback/google`
3. Make sure there are no trailing slashes in the URIs

## Troubleshooting

### Common Issues

**Error: "redirect_uri_mismatch"**
- Make sure the redirect URI in Google Console exactly matches: `http://localhost:3000/api/auth/callback/google`
- No trailing slashes
- Use `http` for localhost (not `https`)

**Error: "invalid_client"**
- Double-check your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
- Make sure there are no extra spaces or quotes

**Error: "Access blocked: This app's request is invalid"**
- Make sure you've configured the OAuth consent screen
- Add your email as a test user
- Enable the required API (Google+ API or People API)

## Next Steps

Once you've completed this setup and added the credentials to your `.env` file, you're ready to proceed with Task 2 (NextAuth configuration).

## Security Notes

- Never commit `.env` file to Git (it's already in `.gitignore`)
- Never share your Client Secret publicly
- Use different credentials for development and production
- Rotate credentials if they're ever exposed
