# Phase 3 Authentication - Testing Guide

This guide provides step-by-step instructions for manually testing the authentication system.

## Prerequisites

Before testing, ensure:
- ✅ Development server is running (`npm run dev`)
- ✅ Database is seeded with test data (`npm run db:seed`)
- ✅ Environment variables are configured (`.env` file)
- ✅ Resend API key is set up for email testing

## Test Credentials

Use these seeded test users:

```
Email: sarah.kim@example.com
Password: password123

Email: john.park@example.com  
Password: password123
```

---

## 12.1 Registration Flow Testing

### Test 1: Successful Registration ✅
**Steps:**
1. Navigate to `/register`
2. Enter:
   - Name: "Test User"
   - Email: "newuser@example.com"
   - Password: "password123"
   - Confirm Password: "password123"
3. Click "Register"

**Expected:**
- ✅ Registration succeeds
- ✅ Auto-login occurs
- ✅ Redirected to homepage
- ✅ User menu shows in header

### Test 2: Duplicate Email Rejection ✅
**Steps:**
1. Navigate to `/register`
2. Enter email: "sarah.kim@example.com" (existing user)
3. Enter valid password
4. Click "Register"

**Expected:**
- ❌ Error: "Email already registered"
- ❌ Registration fails
- ❌ User not logged in

### Test 3: Password Validation ✅

**Test 3a: Too Short**
- Password: "pass12" (6 chars)
- Expected: ❌ "Password must be at least 8 characters"

**Test 3b: No Letter**
- Password: "12345678"
- Expected: ❌ "Password must contain at least one letter"

**Test 3c: No Number**
- Password: "password"
- Expected: ❌ "Password must contain at least one number"

**Test 3d: Passwords Don't Match**
- Password: "password123"
- Confirm: "password456"
- Expected: ❌ "Passwords do not match"

### Test 4: Auto-Login After Registration ✅
**Steps:**
1. Successfully register a new user
2. Check header for user menu

**Expected:**
- ✅ User is automatically logged in
- ✅ No need to manually login
- ✅ Session is active

### Test 5: Rate Limiting (5 per 10 min) ⚠️
**Steps:**
1. Attempt to register 5 times with different emails
2. Attempt 6th registration

**Expected:**
- ✅ First 5 attempts work (or fail for other reasons)
- ❌ 6th attempt: "Too many registration attempts. Please try again later."

---

## 12.2 Login Flow Testing

### Test 1: Successful Login ✅
**Steps:**
1. Navigate to `/login`
2. Enter: sarah.kim@example.com / password123
3. Click "Login"

**Expected:**
- ✅ Login succeeds
- ✅ Redirected to homepage (or intended page)
- ✅ User menu shows user info
- ✅ Protected routes accessible

### Test 2: Invalid Email ✅
**Steps:**
1. Navigate to `/login`
2. Enter: nonexistent@example.com / password123
3. Click "Login"

**Expected:**
- ❌ Error: "Invalid email or password"
- ❌ Login fails
- ℹ️ Generic error (no email enumeration)

### Test 3: Invalid Password ✅
**Steps:**
1. Navigate to `/login`
2. Enter: sarah.kim@example.com / wrongpassword
3. Click "Login"

**Expected:**
- ❌ Error: "Invalid email or password"
- ❌ Login fails
- ℹ️ Same error as invalid email (security)

### Test 4: Redirect to Intended Page ✅
**Steps:**
1. While logged out, try to access `/treatments`
2. Get redirected to `/login?callbackUrl=/treatments`
3. Login successfully

**Expected:**
- ✅ After login, redirected to `/treatments` (not homepage)
- ✅ callbackUrl parameter preserved

### Test 5: Session Persistence ✅
**Steps:**
1. Login successfully
2. Refresh the page (F5)
3. Navigate to different pages
4. Close and reopen browser tab

**Expected:**
- ✅ Session persists across refreshes
- ✅ User stays logged in
- ✅ No need to re-login

---

## 12.3 Logout Flow Testing

### Test 1: Logout Clears Session ✅
**Steps:**
1. Login successfully
2. Click user menu → Logout

**Expected:**
- ✅ Session cleared
- ✅ User menu disappears
- ✅ Login/Register buttons appear

### Test 2: Redirect to Homepage ✅
**Steps:**
1. From any page, click Logout

**Expected:**
- ✅ Redirected to homepage (`/`)

### Test 3: Cannot Access Protected Routes ✅
**Steps:**
1. Logout
2. Try to access `/treatments`, `/clinics`, `/saved`, `/profile`

**Expected:**
- ❌ Redirected to `/login?callbackUrl=<route>`
- ❌ Cannot access protected content

---

## 12.4 Password Reset Flow Testing

### Test 1: Forgot Password Email Sending ✅
**Steps:**
1. Navigate to `/forgot-password`
2. Enter: sarah.kim@example.com
3. Click "Send Reset Link"

**Expected:**
- ✅ Success message: "If that email address is registered, you will receive a password reset link."
- ✅ Email sent to configured email service
- ℹ️ Same message for non-existent emails (security)

### Test 2: Email Delivery and Formatting 📧
**Steps:**
1. Check email inbox (or Resend dashboard)
2. Verify email received

**Expected:**
- ✅ Email from "onboarding@resend.dev" (dev) or configured sender
- ✅ Subject: "Reset Your Pome Password"
- ✅ Contains reset link with token
- ✅ Professional HTML formatting
- ✅ Security notice (1-hour expiry)

### Test 3: Reset Link Functionality ✅
**Steps:**
1. Click reset link from email
2. Should navigate to `/reset-password?token=<token>`

**Expected:**
- ✅ Reset password page loads
- ✅ Token extracted from URL
- ✅ Form ready for new password

### Test 4: Multiple Reset Requests ✅
**Steps:**
1. Request password reset for same email
2. Wait 1 minute
3. Request password reset again
4. Try to use first reset link

**Expected:**
- ✅ Second request invalidates first token
- ❌ First link shows "Invalid or expired reset link"
- ✅ Second link works

### Test 5: Token Expiration (1 hour) ⏰
**Steps:**
1. Request password reset
2. Wait 1 hour (or modify token expiry in code for testing)
3. Try to use reset link

**Expected:**
- ❌ Error: "Password reset token has expired. Please request a new one."

### Test 6: Invalid Token Handling ✅
**Steps:**
1. Navigate to `/reset-password?token=invalidtoken123`
2. Try to submit new password

**Expected:**
- ❌ Error: "Invalid or expired password reset token"

### Test 7: Successful Password Reset ✅
**Steps:**
1. Request password reset
2. Click reset link
3. Enter new password: "newpassword123"
4. Confirm password: "newpassword123"
5. Click "Reset Password"

**Expected:**
- ✅ Success message
- ✅ Redirected to `/login?reset=success`
- ✅ Password updated in database

### Test 8: Old Password No Longer Works ✅
**Steps:**
1. After successful password reset
2. Try to login with old password

**Expected:**
- ❌ Login fails with old password
- ✅ Login succeeds with new password

### Test 9: Rate Limiting (10 per 10 min) ⚠️
**Steps:**
1. Request password reset 10 times
2. Attempt 11th request

**Expected:**
- ✅ First 10 attempts work
- ❌ 11th attempt: "Too many password reset attempts. Please try again later."

---

## 12.5 Route Protection Testing

### Test 1: Unauthenticated Redirect ✅
**Steps:**
1. Logout (or use incognito mode)
2. Try to access:
   - `/treatments`
   - `/clinics`
   - `/search`
   - `/saved`
   - `/profile`

**Expected:**
- ❌ Redirected to `/login?callbackUrl=<route>`
- ❌ Cannot view protected content

### Test 2: Authenticated Access ✅
**Steps:**
1. Login successfully
2. Navigate to protected routes

**Expected:**
- ✅ All protected routes accessible
- ✅ Content loads properly
- ✅ No redirects

### Test 3: API 401 Responses ✅
**Steps:**
1. Logout
2. Open browser DevTools → Network tab
3. Try to call `/api/saved` (e.g., by clicking save button)

**Expected:**
- ❌ Response: 401 Unauthorized
- ❌ Error: "Unauthorized. Please log in."

### Test 4: Redirect After Login ✅
**Steps:**
1. While logged out, click "Treatments" in navigation
2. Get redirected to login
3. Login successfully

**Expected:**
- ✅ After login, redirected back to `/treatments`
- ✅ Not redirected to homepage

---

## 12.6 Saved Items Integration Testing

### Test 1: Saving Items with Authentication ✅
**Steps:**
1. Login
2. Navigate to treatment detail page
3. Click "Save" button

**Expected:**
- ✅ Item saved to database
- ✅ Button changes to "Saved"
- ✅ API call to `/api/saved` succeeds

### Test 2: User-Specific Saved Items ✅
**Steps:**
1. Login as User A, save some items
2. Logout
3. Login as User B
4. Check saved items

**Expected:**
- ✅ User B sees only their saved items
- ✅ User A's saved items not visible
- ✅ Data isolation working

### Test 3: Saved Items Persist ✅
**Steps:**
1. Login, save items
2. Logout
3. Login again
4. Check saved items

**Expected:**
- ✅ Saved items still there
- ✅ Data persisted in database
- ✅ Not lost on logout

### Test 4: API Protection ✅
**Steps:**
1. Logout
2. Try to access `/api/saved` directly (via browser or Postman)

**Expected:**
- ❌ 401 Unauthorized response
- ❌ Cannot access without authentication

---

## 12.7 Session Management Testing

### Test 1: Session Persists 30 Days ⏰
**Steps:**
1. Login
2. Check cookie expiration in DevTools → Application → Cookies

**Expected:**
- ✅ `next-auth.session-token` cookie exists
- ✅ Expires in ~30 days
- ✅ HTTP-only flag set

### Test 2: Session Invalidation on Password Reset ✅
**Steps:**
1. Login on two different browsers/devices
2. Request password reset and complete it
3. Check both sessions

**Expected:**
- ❌ Both sessions invalidated
- ❌ Need to re-login on both devices
- ℹ️ Note: With JWT strategy, sessions expire naturally (not immediately revoked)

### Test 3: Logout Invalidates Session ✅
**Steps:**
1. Login
2. Logout
3. Try to access protected route

**Expected:**
- ❌ Session cleared
- ❌ Redirected to login

---

## 12.8 Rate Limiting Testing

### Test 1: Registration Rate Limit ⚠️
**Limit:** 5 registrations per 10 minutes per IP

**Steps:**
1. Attempt 6 registrations in quick succession

**Expected:**
- ✅ First 5 attempts processed
- ❌ 6th attempt: 429 Too Many Requests

### Test 2: Forgot Password Rate Limit ⚠️
**Limit:** 10 requests per 10 minutes per IP

**Steps:**
1. Request password reset 11 times

**Expected:**
- ✅ First 10 attempts processed
- ❌ 11th attempt: 429 Too Many Requests

### Test 3: Rate Limit Reset ⏰
**Steps:**
1. Hit rate limit
2. Wait 10 minutes
3. Try again

**Expected:**
- ✅ Rate limit resets after window
- ✅ New requests allowed

---

## Security Validation Checklist

### Password Security ✅
- [ ] Passwords hashed with bcrypt (check database)
- [ ] Salt rounds = 10 (check code)
- [ ] Plain passwords never stored
- [ ] Passwords never logged in console

### Session Security ✅
- [ ] HTTP-only cookies set
- [ ] Secure flag in production
- [ ] SameSite=Lax
- [ ] 30-day expiration
- [ ] JWT strategy (for Credentials provider)

### Token Security ✅
- [ ] Reset tokens hashed with SHA-256
- [ ] Tokens are single-use
- [ ] 1-hour expiration
- [ ] Secure random generation (32 bytes)

### Error Messages ✅
- [ ] Generic login errors (no email enumeration)
- [ ] No sensitive data in errors
- [ ] Detailed errors only in server logs

---

## Known Issues & Limitations

### JWT Strategy Trade-offs
⚠️ **Session Revocation**: With JWT strategy, sessions cannot be immediately revoked server-side. Sessions expire naturally after 30 days or when user logs out client-side.

**Mitigation:**
- Password reset clears client-side session
- 30-day expiration is reasonable security/UX balance
- Future: Can add token blacklist if needed

### Rate Limiting
⚠️ **Multi-Instance Limitation**: In-memory rate limiting is per-instance. In production with auto-scaling, users could bypass limits by hitting different instances.

**Mitigation:**
- Acceptable for Phase 3 MVP
- Upgrade to Redis/Upstash in Phase 5

---

## Testing Completion Checklist

- [ ] 12.1 Registration flow (5 tests)
- [ ] 12.2 Login flow (5 tests)
- [ ] 12.3 Logout flow (3 tests)
- [ ] 12.4 Password reset flow (9 tests)
- [ ] 12.5 Route protection (4 tests)
- [ ] 12.6 Saved items integration (4 tests)
- [ ] 12.7 Session management (3 tests)
- [ ] 12.8 Rate limiting (3 tests)

**Total: 36 manual tests**

---

## Reporting Issues

If you find any issues during testing:

1. Note the test number and description
2. Document steps to reproduce
3. Include error messages and screenshots
4. Check browser console for errors
5. Check server logs for detailed errors

---

## Next Steps

After completing all tests:
1. ✅ Mark Task 12 as complete
2. ✅ Move to Task 13 (Security Validation)
3. ✅ Move to Task 14 (Documentation)
4. ✅ Final integration testing (Task 16)
