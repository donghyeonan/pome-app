# Google OAuth Testing Plan - Task 5

This document provides a comprehensive manual testing plan for the Google OAuth integration in the Pome application.

## Prerequisites

Before starting testing, ensure:

- ✅ Google OAuth credentials configured in `.env`
- ✅ Development server running: `npm run dev`
- ✅ Database accessible: `npm run db:studio` (open in another terminal)
- ✅ Browser with dev tools open (for inspecting cookies/network)

## Testing Tools

### 1. Prisma Studio (Database GUI)

```bash
npm run db:studio
```

Open at: `http://localhost:5555`

Use this to verify:
- User records created
- Account records linked
- emailVerified timestamps
- No duplicate records

### 2. Browser Dev Tools

- **Application tab**: Check cookies (next-auth.session-token)
- **Network tab**: Monitor OAuth redirects
- **Console tab**: Check for errors

---

## Test Suite

### Test 5.1: New User Registration via Google

**Scenario**: A completely new user signs up using Google OAuth for the first time.

#### Steps:

1. **Prepare:**
   - Open Prisma Studio
   - Note current user count in User table
   - Use a Google account that has NEVER been used on Pome

2. **Execute:**
   - Navigate to `http://localhost:3000/login`
   - Click "Sign in with Google" button
   - **Expected**: Button shows spinner and text "Signing in..."

3. **Google OAuth Consent:**
   - **Expected**: Redirected to Google OAuth consent screen
   - URL should contain: `accounts.google.com`
   - Should show: "Pome wants to access your Google Account"
   - Requested permissions: View email, View basic profile info

4. **Approve:**
   - Click "Continue" or "Allow"
   - **Expected**: Redirected back to `http://localhost:3000/`
   - Should be logged in immediately

5. **Verify in Browser:**
   - Check Application > Cookies > `next-auth.session-token` exists
   - Check Network tab: Should see redirects to `/api/auth/callback/google`

6. **Verify in Prisma Studio:**
   - Refresh User table
   - **Expected**: New user created with:
     - ✅ `email` matches your Google email
     - ✅ `name` matches your Google name
     - ✅ `emailVerified` is set (not null)
     - ✅ `passwordHash` is null

   - Open Account table
   - **Expected**: New account record with:
     - ✅ `provider` = "google"
     - ✅ `userId` matches the new user's ID
     - ✅ `providerAccountId` is set (Google user ID)
     - ✅ `access_token` is present
     - ✅ `id_token` is present

7. **Verify Session:**
   - Visit a protected route: `http://localhost:3000/saved`
   - **Expected**: Page loads without redirect to login
   - User menu should show your name and email

#### ✅ Pass Criteria:
- [ ] Redirected to Google OAuth consent screen
- [ ] Returned to homepage after approval
- [ ] New User record created
- [ ] emailVerified is set
- [ ] Account record created with provider "google"
- [ ] Session works (protected routes accessible)
- [ ] No errors in console

---

### Test 5.2: Existing User Account Linking

**Scenario**: A user who previously registered with email/password now signs in with Google using the same email.

#### Steps:

1. **Prepare - Create Email/Password User:**
   - Navigate to `http://localhost:3000/register`
   - Register with:
     - Name: Test User
     - Email: `your-actual-google-email@gmail.com` (IMPORTANT: Use same email as your Google account)
     - Password: `password123`
   - Log out after registration

2. **Verify Initial State:**
   - Open Prisma Studio
   - Find the user you just created
   - Note the `id` (e.g., `clxxxxx123`)
   - Check Account table: Should be EMPTY for this user (no Google account yet)
   - Note: `emailVerified` is probably NULL (not verified via email)

3. **Execute - Sign In with Google:**
   - Navigate to `http://localhost:3000/login`
   - Click "Sign in with Google"
   - Approve Google consent (if asked)
   - **Expected**: Redirected to homepage

4. **Verify Account Linking:**
   - Open Prisma Studio
   - Refresh User table
   - **Expected**:
     - ✅ SAME user record (same `id` as before)
     - ✅ NO duplicate user created
     - ✅ `emailVerified` is NOW set (updated by Google OAuth)

   - Open Account table
   - **Expected**: New Account record with:
     - ✅ `provider` = "google"
     - ✅ `userId` matches the existing user's ID
     - ✅ `providerAccountId` is set
     - ✅ Account is LINKED to existing user

5. **Verify You Can Use Both Methods:**
   - Log out
   - Sign in with email/password (`password123`)
   - **Expected**: Works! ✅
   - Log out
   - Sign in with Google
   - **Expected**: Works! ✅

#### ✅ Pass Criteria:
- [ ] No duplicate user created
- [ ] Google account linked to existing user
- [ ] Account record created with correct userId
- [ ] emailVerified updated to current timestamp
- [ ] Can sign in with both email/password AND Google
- [ ] Same user session regardless of sign-in method

---

### Test 5.3: Repeat Sign-Ins

**Scenario**: A user who already has a Google account linked signs in multiple times.

#### Steps:

1. **Prepare:**
   - Use a user that already has Google account linked (from Test 5.1 or 5.2)
   - Open Prisma Studio
   - Note the Account record count for this user

2. **Execute - First Sign-In:**
   - Navigate to `http://localhost:3000/login`
   - Click "Sign in with Google"
   - Approve (if asked)
   - **Expected**: Logged in successfully

3. **Execute - Sign Out and Sign In Again:**
   - Log out
   - Navigate to `http://localhost:3000/login`
   - Click "Sign in with Google" again
   - **Expected**: Logged in successfully (faster this time)

4. **Repeat 3-5 Times:**
   - Log out and sign in with Google multiple times

5. **Verify in Prisma Studio:**
   - Refresh Account table
   - **Expected**:
     - ✅ ONLY ONE Account record with provider "google"
     - ✅ NO duplicate Account records created

   - Check User table
   - **Expected**:
     - ✅ ONLY ONE User record
     - ✅ NO duplicate users

#### ✅ Pass Criteria:
- [ ] Multiple sign-ins work correctly
- [ ] No duplicate Account records created
- [ ] No duplicate User records created
- [ ] Sign-in gets faster after first time (Google remembers consent)

---

### Test 5.4: Session Management

**Scenario**: Verify that Google OAuth sessions work identically to email/password sessions.

#### Steps:

1. **Test Session Persistence:**
   - Sign in with Google
   - Close browser tab
   - Reopen `http://localhost:3000`
   - **Expected**: Still logged in ✅

2. **Test Protected Routes:**
   - Visit `http://localhost:3000/saved`
   - **Expected**: Access granted ✅
   - Visit `http://localhost:3000/profile`
   - **Expected**: Access granted ✅

3. **Test Logout:**
   - Click logout button
   - **Expected**: Redirected to login page
   - Visit `http://localhost:3000/saved`
   - **Expected**: Redirected to login (session invalidated) ✅

4. **Test Session Cookie:**
   - Sign in with Google
   - Open Dev Tools > Application > Cookies
   - Find `next-auth.session-token`
   - **Expected**:
     - ✅ HttpOnly flag is set
     - ✅ Secure flag is set (in production)
     - ✅ SameSite is Lax

5. **Test Session Expiration (Optional):**
   - **Note**: Session expires in 30 days
   - You can't easily test this, but verify in code:
     - Check `src/lib/auth.ts`: `maxAge: 30 * 24 * 60 * 60`

#### ✅ Pass Criteria:
- [ ] Session persists across browser restarts
- [ ] Protected routes accessible with Google auth
- [ ] Logout invalidates session correctly
- [ ] Session cookie has correct security flags
- [ ] Session expiration is 30 days (verified in code)

---

### Test 5.5: Error Scenarios

**Scenario**: Test error handling and edge cases.

#### Test 5.5a: User Cancels OAuth

**Steps:**
1. Navigate to `http://localhost:3000/login`
2. Click "Sign in with Google"
3. On Google consent screen, click "Cancel" or "Back"
4. **Expected**: Redirected back to `/login`
5. **Expected**: No error message (user intentionally cancelled)
6. **Expected**: Can try again

**✅ Pass Criteria:**
- [ ] Redirected to login page
- [ ] No crash or error page
- [ ] Can retry sign-in

---

#### Test 5.5b: Invalid Credentials

**Steps:**
1. Stop the dev server
2. In `.env`, temporarily change `GOOGLE_CLIENT_SECRET` to something invalid
3. Start dev server: `npm run dev`
4. Navigate to `http://localhost:3000/login`
5. Click "Sign in with Google"
6. **Expected**: OAuth flow fails, redirected to error page or login

**After Test:**
- Restore correct `GOOGLE_CLIENT_SECRET`
- Restart dev server

**✅ Pass Criteria:**
- [ ] Doesn't crash the app
- [ ] Shows error or redirects to login
- [ ] Error logged in server console

---

#### Test 5.5c: Network Interruption (Optional)

**Steps:**
1. Start OAuth flow
2. Disconnect internet during OAuth redirect
3. **Expected**: Browser shows network error
4. Reconnect internet
5. Retry sign-in
6. **Expected**: Works normally

---

## Database Verification Checklist

Use Prisma Studio to verify data integrity after tests:

### User Table
```
✅ Check: No duplicate users with same email
✅ Check: emailVerified is set for Google users
✅ Check: passwordHash is null for Google-only users
✅ Check: name and email populated correctly
```

### Account Table
```
✅ Check: Each user has at most ONE Google account (provider="google")
✅ Check: userId matches User table correctly
✅ Check: providerAccountId is unique per user
✅ Check: access_token and refresh_token are present
✅ Check: No orphaned accounts (userId must exist in User table)
```

### Session Verification (In Browser)
```
✅ Check: next-auth.session-token cookie exists
✅ Check: Cookie is HttpOnly
✅ Check: Cookie is Secure (in production)
```

---

## Troubleshooting Guide

### Issue: "redirect_uri_mismatch" Error

**Cause**: Redirect URI in Google Console doesn't match

**Solution**:
1. Go to Google Cloud Console
2. Check Authorized redirect URIs
3. Must be EXACTLY: `http://localhost:3000/api/auth/callback/google`
4. No trailing slash!

---

### Issue: "invalid_client" Error

**Cause**: Wrong Client ID or Client Secret

**Solution**:
1. Check `.env` file
2. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
3. No extra spaces or quotes
4. Restart dev server after changing `.env`

---

### Issue: User Not Created

**Cause**: Database error or callback failure

**Solution**:
1. Check server console logs
2. Check Prisma Studio for errors
3. Verify database connection in `.env`
4. Check `DATABASE_URL` is correct

---

### Issue: Account Not Linked

**Cause**: Email mismatch or callback error

**Solution**:
1. Verify emails match EXACTLY (case-sensitive)
2. Check server console for errors
3. Check signIn callback in `src/lib/auth.ts`
4. Add console.logs to debug:
   ```typescript
   console.log('Google email:', user.email);
   console.log('Existing user:', existingUser);
   ```

---

### Issue: Button Doesn't Work

**Cause**: Import error or component issue

**Solution**:
1. Check browser console for errors
2. Verify `GoogleSignInButton` is imported correctly
3. Check that `signIn` from `next-auth/react` is available
4. Restart dev server

---

## Testing Checklist Summary

### Quick Checklist

- [ ] **Test 5.1**: New user registration via Google
- [ ] **Test 5.2**: Existing user account linking
- [ ] **Test 5.3**: Repeat sign-ins (no duplicates)
- [ ] **Test 5.4**: Session management
- [ ] **Test 5.5a**: User cancels OAuth
- [ ] **Test 5.5b**: Invalid credentials
- [ ] **Database verification**: No duplicates, correct data
- [ ] **Session verification**: Cookies set correctly
- [ ] **Logout works**: Session invalidated
- [ ] **Protected routes work**: Access granted when authenticated

---

## Success Criteria

All tests pass if:

✅ New users can register via Google
✅ Existing users can link Google accounts
✅ No duplicate users or accounts created
✅ emailVerified set correctly
✅ Sessions work identically to email/password
✅ Logout invalidates sessions
✅ Protected routes accessible
✅ Errors handled gracefully

---

## Next Steps After Testing

Once all tests pass:

1. **Document any issues found** in `TESTING_RESULTS.md`
2. **Proceed to Task 6**: Property-based testing (requires test setup)
3. **Proceed to Task 7**: Update documentation
4. **Proceed to Task 8**: Deployment preparation

---

## Notes

- **Use real Google account**: Test accounts may have restrictions
- **Test in incognito**: To avoid cached Google sessions
- **Check server logs**: Errors logged to console
- **Use Prisma Studio**: Best way to verify database state
- **Take screenshots**: Document successful flows

---

**Good luck with testing!** 🚀

If you encounter any issues, refer to the Troubleshooting Guide or check the server console logs.
