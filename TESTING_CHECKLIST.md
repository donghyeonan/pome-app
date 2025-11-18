# Google OAuth Testing Checklist

Quick reference checklist for testing Google OAuth integration.

## Before You Start

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Open Prisma Studio
npm run db:studio
```

Open browser dev tools (F12) > Application tab

---

## Test 1: New User Registration ✅

- [ ] Go to `/login`
- [ ] Click "Sign in with Google"
- [ ] See loading spinner
- [ ] Redirected to Google consent screen
- [ ] Approve permissions
- [ ] Redirected to homepage
- [ ] Logged in successfully

**Verify in Prisma Studio:**
- [ ] New User created (email, name, emailVerified set)
- [ ] New Account created (provider="google")
- [ ] passwordHash is null

---

## Test 2: Account Linking ✅

**Setup:**
- [ ] Register via `/register` with email/password
- [ ] Use YOUR REAL Google email
- [ ] Log out

**Test:**
- [ ] Go to `/login`
- [ ] Click "Sign in with Google"
- [ ] Approve
- [ ] Logged in successfully

**Verify in Prisma Studio:**
- [ ] NO duplicate user (same user ID)
- [ ] emailVerified updated
- [ ] Account record added with provider="google"
- [ ] Can log in with BOTH methods now

---

## Test 3: Repeat Sign-Ins ✅

- [ ] Sign in with Google
- [ ] Log out
- [ ] Sign in with Google again
- [ ] Repeat 3-5 times

**Verify in Prisma Studio:**
- [ ] ONLY ONE Account record (no duplicates)
- [ ] ONLY ONE User record

---

## Test 4: Session Management ✅

- [ ] Sign in with Google
- [ ] Close tab, reopen → Still logged in
- [ ] Visit `/saved` → Access granted
- [ ] Visit `/profile` → Access granted
- [ ] Click logout → Redirected to login
- [ ] Visit `/saved` → Redirected to login (session gone)

**Verify in Browser:**
- [ ] Cookie `next-auth.session-token` exists
- [ ] HttpOnly flag set
- [ ] Secure flag set (production)

---

## Test 5: Error Scenarios ✅

### Cancel OAuth
- [ ] Click "Sign in with Google"
- [ ] Click "Cancel" on Google screen
- [ ] Redirected to login (no crash)

### Invalid Credentials (Optional)
- [ ] Change `GOOGLE_CLIENT_SECRET` to invalid
- [ ] Restart dev server
- [ ] Try sign in → Error shown
- [ ] Restore correct secret

---

## Database Health Check

**User Table:**
- [ ] No duplicate emails
- [ ] emailVerified set for Google users
- [ ] passwordHash null for Google-only users

**Account Table:**
- [ ] Max 1 Google account per user
- [ ] All userId values exist in User table
- [ ] providerAccountId unique

---

## Quick Commands

```bash
# Start dev server
npm run dev

# Open Prisma Studio (database GUI)
npm run db:studio

# Check database
npm run db:migrate

# View logs
# Check terminal running npm run dev
```

---

## Common URLs

- Login: `http://localhost:3000/login`
- Register: `http://localhost:3000/register`
- Saved: `http://localhost:3000/saved` (protected)
- Profile: `http://localhost:3000/profile` (protected)
- Prisma Studio: `http://localhost:5555`

---

## Quick Fixes

**"redirect_uri_mismatch"**
→ Check Google Console redirect URI is exactly:
`http://localhost:3000/api/auth/callback/google`

**"invalid_client"**
→ Check `.env` has correct `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

**Button doesn't work**
→ Check browser console for errors
→ Restart dev server

---

## Success! 🎉

All tests pass? You're done with Task 5!

✅ New users can register via Google
✅ Existing users can link accounts
✅ No duplicates created
✅ Sessions work correctly
✅ Errors handled gracefully

**Next:** Document results and move to Task 6/7
