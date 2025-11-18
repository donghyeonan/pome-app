# Phase 3 Authentication - Quick Testing Checklist

Use this checklist to track your testing progress.

## Setup
- [ ] Dev server running (`npm run dev`)
- [ ] Database seeded (`npm run db:seed`)
- [ ] Environment variables configured
- [ ] Test credentials ready

---

## 12.1 Registration Flow (5 tests)
- [ ] ✅ Successful registration with valid data
- [ ] ❌ Duplicate email rejection
- [ ] ❌ Password too short (< 8 chars)
- [ ] ❌ Password missing letter
- [ ] ❌ Password missing number
- [ ] ❌ Passwords don't match
- [ ] ✅ Auto-login after registration
- [ ] ⚠️ Rate limiting (6th attempt fails)

## 12.2 Login Flow (5 tests)
- [ ] ✅ Successful login with valid credentials
- [ ] ❌ Invalid email error (generic message)
- [ ] ❌ Invalid password error (generic message)
- [ ] ✅ Redirect to intended page after login
- [ ] ✅ Session persists across page refreshes

## 12.3 Logout Flow (3 tests)
- [ ] ✅ Logout clears session
- [ ] ✅ Redirect to homepage after logout
- [ ] ❌ Cannot access protected routes after logout

## 12.4 Password Reset Flow (9 tests)
- [ ] ✅ Forgot password email sent
- [ ] 📧 Email delivered with correct formatting
- [ ] ✅ Reset link navigates to reset page
- [ ] ✅ Multiple requests invalidate old tokens
- [ ] ⏰ Token expires after 1 hour
- [ ] ❌ Invalid token shows error
- [ ] ✅ Successful password reset
- [ ] ❌ Old password no longer works
- [ ] ✅ New password works
- [ ] ⚠️ Rate limiting (11th attempt fails)

## 12.5 Route Protection (4 tests)
- [ ] ❌ Unauthenticated users redirected to login
- [ ] ✅ Authenticated users can access protected routes
- [ ] ❌ API returns 401 without authentication
- [ ] ✅ Redirect to intended page after login

## 12.6 Saved Items Integration (4 tests)
- [ ] ✅ Save items with real authentication
- [ ] ✅ User-specific saved items (data isolation)
- [ ] ✅ Saved items persist after logout/login
- [ ] ❌ API protected (401 without auth)

## 12.7 Session Management (3 tests)
- [ ] ✅ Session cookie expires in 30 days
- [ ] ✅ HTTP-only cookie flag set
- [ ] ✅ Logout invalidates session

## 12.8 Rate Limiting (3 tests)
- [ ] ⚠️ Registration: 5 per 10 min per IP
- [ ] ⚠️ Forgot password: 10 per 10 min per IP
- [ ] ⏰ Rate limit resets after window

---

## Security Validation

### Password Security
- [ ] Passwords hashed with bcrypt (check DB)
- [ ] Salt rounds = 10 (check code: `src/lib/password.ts`)
- [ ] Plain passwords never stored
- [ ] Passwords never logged

### Session Security
- [ ] HTTP-only cookies (check DevTools)
- [ ] Secure flag in production
- [ ] SameSite=Lax
- [ ] 30-day expiration
- [ ] JWT strategy (check `src/lib/auth.ts`)

### Token Security
- [ ] Reset tokens hashed with SHA-256 (check code)
- [ ] Tokens are single-use (check DB after use)
- [ ] 1-hour expiration
- [ ] Secure random generation (32 bytes)

### Error Messages
- [ ] Generic login errors (no email enumeration)
- [ ] No sensitive data in client errors
- [ ] Detailed errors only in server logs

---

## Test Results Summary

**Total Tests:** 36
**Passed:** ___
**Failed:** ___
**Skipped:** ___

**Issues Found:**
1. 
2. 
3. 

**Notes:**


---

## Sign-off

- [ ] All critical tests passed
- [ ] Known issues documented
- [ ] Ready for production deployment

**Tested by:** _______________
**Date:** _______________
**Signature:** _______________
