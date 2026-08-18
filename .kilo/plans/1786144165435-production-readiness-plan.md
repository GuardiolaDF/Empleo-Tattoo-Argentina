# Production Readiness Plan: Empleo Tattoo Argentina

## Project Overview
SaaS platform for tattoo job postings in Argentina. Studios post job offers, artists browse/apply. Revenue via MercadoPago payments for job listings.

**Tech Stack:** Next.js 16.2.4, React 19, TypeScript, MongoDB/Mongoose, NextAuth v5, MercadoPago, Resend, Cloudinary, Vercel

---

## Phase 1: Security Audit & Hardening (Critical)

### 1.1 Authentication & Authorization
- [ ] **Fix auth vulnerability**: `src/auth.ts` Credentials provider allows login without email verification
- [ ] **Implement email verification flow** for Credentials provider
- [ ] **Add rate limiting** to `/api/auth/*` endpoints (currently missing)
- [ ] **Secure session configuration**: Add `secure: true` cookies in production, `sameSite: 'lax'`
- [ ] **Add CSRF protection** for forms (NextAuth handles this but verify)
- [ ] **Implement account lockout** after failed login attempts

### 1.2 Input Validation & Sanitization
- [ ] **Add Zod validation** to all API routes (`/api/jobs`, `/api/studio`, `/api/create-payment`, `/api/upload`)
- [ ] **Sanitize user inputs** in job posting form (XSS prevention)
- [ ] **Validate file uploads**: MIME type, size limits, malware scanning
- [ ] **Add request body size limits** to prevent DoS

### 1.3 API Security
- [ ] **Implement proper rate limiting** with Redis/Upstash (current in-memory Map resets on cold starts)
- [ ] **Add security headers** via `next.config.ts` (CSP, HSTS, X-Frame-Options, etc.)
- [ ] **Verify webhook signatures** for ALL webhooks (MercadoPago implemented, check others)
- [ ] **Add API versioning** strategy
- [ ] **Implement request/response logging** for audit trail

### 1.4 Data Protection
- [ ] **Encrypt sensitive fields** in MongoDB (passwords already hashed with bcrypt)
- [ ] **Add PII data classification** and handling procedures
- [ ] **Implement data retention policies** for jobs, users, analytics
- [ ] **Add GDPR/LGPD compliance** (user data export, deletion)

### 1.5 Secrets Management
- [ ] **Move all secrets to Vercel Environment Variables** (currently in `.env.local`)
- [ ] **Rotate all exposed credentials** (Google OAuth, MercadoPago, Resend, Cloudinary, MongoDB)
- [ ] **Add secret scanning** to CI/CD pipeline
- [ ] **Remove `client_secret_*.json` file** from repo root (security risk)

### 1.6 Dependency Security
- [ ] **Run `npm audit`** and fix vulnerabilities
- [ ] **Add `npm audit` to CI pipeline**
- [ ] **Pin dependency versions** more strictly (avoid `^` for critical deps)
- [ ] **Monitor for CVEs** in production dependencies

---

## Phase 2: Infrastructure & Deployment Readiness

### 2.1 Vercel Configuration
- [ ] **Configure `next.config.ts`** for production:
  - [ ] `output: 'standalone'` for smaller deployments
  - [ ] `images.domains` for Cloudinary
  - [ ] Security headers
  - [ ] `experimental.serverActions` if used
- [ ] **Set up Vercel project** with proper environment variables
- [ ] **Configure custom domain** (`empleotattoo.com.ar`)
- [ ] **Set up preview deployments** for PRs

### 2.2 Database (MongoDB Atlas)
- [ ] **Configure production cluster** (not shared dev cluster)
- [ ] **Set up database indexes** for query performance:
  - [ ] `jobs: { status: 1, createdAt: -1 }`
  - [ ] `jobs: { userId: 1, createdAt: -1 }`
  - [ ] `studios: { userId: 1 }` (unique)
  - [ ] `subscribers: { email: 1 }` (unique)
- [ ] **Configure connection pooling** (already using Mongoose cache)
- [ ] **Set up automated backups** and point-in-time recovery
- [ ] **Configure IP whitelist** for Vercel IPs only

### 2.3 Monitoring & Observability
- [ ] **Add error tracking** (Sentry or Vercel Runtime Logs)
- [ ] **Implement structured logging** (Pino or similar)
- [ ] **Set up uptime monitoring** (Vercel + external)
- [ ] **Add custom metrics** (job posts, payments, signups)
- [ ] **Configure alerting** for critical errors, payment failures

### 2.4 CI/CD Pipeline
- [ ] **Create GitHub Actions workflow**:
  - [ ] Lint (`npm run lint`)
  - [ ] Type check (`tsc --noEmit`)
  - [ ] Unit/Integration tests
  - [ ] Build verification (`npm run build`)
  - [ ] Security audit (`npm audit`)
  - [ ] Deploy preview on PR
  - [ ] Deploy production on merge to main

---

## Phase 3: Functional Completeness & MVP Features

### 3.1 Core User Flows
- [ ] **Complete job posting flow**: Form → Preview → Payment → Activation
- [ ] **Artist job browsing**: Search, filter, pagination (currently missing)
- [ ] **Studio dashboard**: CRUD for job postings, analytics
- [ ] **Studio profile management**: Complete CRUD (partial exists)
- [ ] **Authentication flows**: Login, register, password reset, email verification
- [ ] **Email notifications**: Welcome, job confirmation, payment receipts, newsletter

### 3.2 Payment Integration (MercadoPago)
- [ ] **Fix hardcoded price**: `unit_price: 100` → `20000` ARS in `/api/create-payment`
- [ ] **Add payment status polling** on confirmation page
- [ ] **Implement refund/cancellation flow**
- [ ] **Add payment receipts** (email + PDF)
- [ ] **Test sandbox → production migration** thoroughly
- [ ] **Handle webhook idempotency** (prevent duplicate processing)

### 3.3 Email System (Resend)
- [ ] **Verify sender domain** in Resend (currently using `notificaciones@resend.dev`)
- [ ] **Create email templates** for all transactional emails
- [ ] **Implement email queue** with retry logic (currently fire-and-forget)
- [ ] **Add unsubscribe mechanism** for newsletter
- [ ] **Test email deliverability** (SPF, DKIM, DMARC)

### 3.4 Image Handling (Cloudinary)
- [ ] **Add image optimization** transformations (already partial)
- [ ] **Implement image deletion** when studio/job deleted
- [ ] **Add upload progress indicators** on frontend
- [ ] **Validate image dimensions/aspect ratios**

---

## Phase 4: Testing & Quality Assurance

### 4.1 Automated Testing
- [ ] **Set up test framework** (Jest + React Testing Library + Playwright)
- [ ] **Unit tests** for:
  - [ ] Auth utilities
  - [ ] API route handlers
  - [ ] Data models/validation
  - [ ] Payment processing logic
- [ ] **Integration tests** for:
  - [ ] Job posting flow
  - [ ] Payment webhook handling
  - [ ] Studio CRUD operations
- [ ] **E2E tests** for critical user journeys:
  - [ ] Studio signs up → creates profile → posts job → pays → job activates
  - [ ] Artist browses → filters → views job details

### 4.2 Manual Testing Checklist
- [ ] **Cross-browser testing** (Chrome, Firefox, Safari, Edge)
- [ ] **Mobile responsiveness** (320px - 1920px)
- [ ] **Accessibility audit** (WCAG 2.1 AA)
- [ ] **Performance testing** (Lighthouse CI)
- [ ] **Load testing** (k6 for API endpoints)
- [ ] **Payment flow testing** (sandbox + production)

### 4.3 Code Quality
- [ ] **Fix ESLint warnings** (run `npm run lint`)
- [ ] **Add Prettier** for consistent formatting
- [ ] **Add Husky + lint-staged** for pre-commit hooks
- [ ] **Enforce TypeScript strict mode** (verify `tsconfig.json`)
- [ ] **Remove `console.log` statements** from production code

---

## Phase 5: Legal, Compliance & Operations

### 5.1 Legal Pages
- [ ] **Complete Terms of Service** (`/terminos` - exists but verify content)
- [ ] **Complete Privacy Policy** (`/privacidad` - exists but verify content)
- [ ] **Add Cookie Policy** (required for Argentina/EU)
- [ ] **Add Refund Policy** for job postings

### 5.2 Argentina-Specific Compliance
- [ ] **AFIP compliance** for invoicing (MercadoPago handles but verify)
- [ ] **Consumer protection law** (Ley 24.240) compliance
- [ ] **Data protection** (Ley 25.326 - Argentina's data protection law)
- [ ] **Terms in Spanish** with Argentine legal terminology

### 5.3 Operational Procedures
- [ ] **Create runbooks** for:
  - [ ] Payment failure handling
  - [ ] Database outage
  - [ ] Email delivery issues
  - [ ] Security incident response
- [ ] **Define SLA/SLO** for critical operations
- [ ] **Set up on-call rotation** (if team > 1)
- [ ] **Document deployment/rollback procedures**

---

## Phase 6: Launch Preparation

### 6.1 Pre-Launch Checklist
- [ ] **Security audit complete** (Phase 1)
- [ ] **All tests passing** (Phase 4)
- [ ] **Load test passed** (target: 100 concurrent users)
- [ ] **Monitoring dashboards live**
- [ ] **Rollback plan tested**
- [ ] **Stakeholder sign-off**

### 6.2 Launch Day
- [ ] **Deploy to production** during low-traffic window
- [ ] **Verify all critical paths** in production
- [ ] **Monitor error rates** for 2 hours post-deploy
- [ ] **Confirm payment processing** with test transaction
- [ ] **Announce launch** (social media, newsletter)

### 6.3 Post-Launch (Week 1)
- [ ] **Daily monitoring** of errors, performance, payments
- [ ] **Collect user feedback** (Hotjar, surveys)
- [ ] **Fix critical bugs** within 24h
- [ ] **Iterate on UX** based on real usage

---

## Priority Matrix

| Priority | Items | Effort | Risk if Skipped |
|----------|-------|--------|-----------------|
| **P0 - Blockers** | Security audit, Secrets rotation, Payment price fix, Email domain verification | High | Data breach, Financial loss, Legal liability |
| **P1 - Critical** | Rate limiting, Input validation, DB indexes, CI/CD, Error tracking | Medium | DoS attacks, Data corruption, Deployment failures |
| **P2 - Important** | Tests, Accessibility, Performance, Legal pages, Monitoring | Medium | Poor UX, Compliance issues, Debugging difficulty |
| **P3 - Nice to Have** | Advanced analytics, A/B testing, Internationalization | Low | Competitive disadvantage |

---

## Dependencies Between Phases

```
Phase 1 (Security) ──────────────────┐
                                     ├─→ Phase 2 (Infra) ──→ Phase 3 (Features) ──→ Phase 4 (Testing) ──→ Phase 6 (Launch)
Phase 5 (Legal/Compliance) ─────────┘                                                      ↑
                                                                                           │
                                              Phase 5 (Legal) ────────────────────────────┘
```

**Critical Path:** Security → Infrastructure → Core Features → Testing → Launch

---

## Resource Requirements

| Role | Time Estimate | Skills Needed |
|------|---------------|---------------|
| Security Engineer | 2-3 weeks | AppSec, Node.js, MongoDB, NextAuth |
| Backend Developer | 2-3 weeks | Next.js, MongoDB, MercadoPago, Resend |
| Frontend Developer | 1-2 weeks | React, Tailwind, Testing |
| DevOps Engineer | 1 week | Vercel, GitHub Actions, MongoDB Atlas |
| QA Engineer | 1 week | Jest, Playwright, k6, Accessibility |

---

## Success Criteria (Definition of Done)

- [ ] **Security**: 0 critical/high vulnerabilities, all secrets rotated
- [ ] **Performance**: Lighthouse > 90, API p95 < 500ms
- [ ] **Reliability**: 99.9% uptime SLO, < 1% error rate
- [ ] **Functionality**: All MVP user flows work end-to-end
- [ ] **Testing**: >80% code coverage, all E2E tests pass
- [ ] **Compliance**: Legal pages complete, Argentina regulations met
- [ ] **Operations**: Monitoring alerting, runbooks documented

---

## Next Steps

1. **Immediate** (This Week):
   - Rotate all exposed credentials
   - Fix hardcoded payment price
   - Verify Resend domain
   - Remove client_secret JSON from repo

2. **Week 1-2**: Security audit + Infrastructure setup
3. **Week 2-3**: Core feature completion + Testing setup
4. **Week 3-4**: Testing execution + Legal compliance
5. **Week 4**: Launch preparation + Go-live

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| MercadoPago production approval delays | Medium | High | Start approval process now; test extensively in sandbox |
| MongoDB Atlas scaling issues | Low | High | Configure auto-scaling; load test before launch |
| Email deliverability problems | Medium | Medium | Warm up domain; implement retry queue; monitor bounces |
| Security vulnerability in dependencies | Medium | High | Automated scanning; rapid patching process |
| Team bandwidth constraints | High | Medium | Prioritize P0/P1; defer P3 to post-launch |

---

*Plan generated: 2026-08-07 | Version: 1.0*