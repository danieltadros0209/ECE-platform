# ECE Stipend Application

## Overview

A small stipend/grant application flow: form at `/apply`, API at `POST /api/applications`, in‑memory persistence, triage rules, and a decoupled handoff record for downstream processing.

## Key implementations

- End‑to‑end submit flow from `/apply` to `/api/applications`
- Server‑side API key proxy to keep secrets off the client
- In‑memory persistence with HMR‑safe store behavior
- Triage rules with clear `reviewTier` and `riskFlags`
- Strict handoff contract built via a single mapping function
- Tests covering API auth, triage logic, and store persistence

## What’s included

- **UI**: Next.js (App Router) + TypeScript + Bootstrap. Page at `/apply` with all required applicant and program fields.
- **API**: `POST /api/applications` — validates input, persists application in memory, runs triage, creates handoff record, returns `applicationId`, `reviewTier`, `riskFlags`. Requires header `X-API-Key`; returns 401 if missing or wrong.
- **Submit proxy**: `POST /api/submit` — server-only route that forwards to `/api/applications` and injects the API key (so the browser never has it).
- **Persistence**: In-memory only (no DB). Full applications and handoff records in `lib/store.ts`.
- **Triage**: `lib/triage.ts` sets `reviewTier` and `riskFlags`: amount > $1000, applicant under 18, invalid/unusual SSN pattern.
- **Handoff**: Separate in-memory record per submission (no PII): `applicationId`, `submittedAt`, `reviewTier`, `riskFlags`, `programName`, `amountRequested`, `applicantRef`.

## Setup

1. Install

   ```bash
   npm install
   ```

2. Create `.env.local`

   ```bash
   API_KEY=your-secret-key
   ```

3. Run
   ```bash
   npm run dev
   ```

## Usage

- Open [http://localhost:3000/apply](http://localhost:3000/apply)

## Testing

```bash
npm test
```

## PII handling

- **Treated as sensitive**: full name, email, phone, date of birth, SSN, and full address.
- **Avoiding exposure**:
  - API response returns only `applicationId`, `reviewTier`, and `riskFlags` — no PII.
  - API keys are server‑only and never echoed back in responses.
  - Handoff records contain no PII; only an `applicantRef` (opaque id) links to the full application.
  - Handoff data uses strict, separate contracts, and a single mapping function builds the handoff record from the stored application.
  - No logging of request bodies or stored application content; no PII appears in `riskFlags`.
  - Full applications are encrypted using `AES‑256‑GCM` before being written to the in‑memory store. The backend never stores raw PII.
  - The frontend uses an `SSN mask` so the value is never visibly exposed to people nearby or captured accidentally in screenshots.
  - A tooltip explains why the SSN is required, reducing confusion and helping applicants understand the purpose of the field.

## Business rules and handoff

- **Triage**: after validation and persistence, `triageApplication()` runs:
  - Amount requested > $1000 → manual review, flag “Amount requested above threshold”.
  - Applicant under 18 (from DOB) → manual review, flag “Applicant under 18”.
  - Invalid/unusual SSN → manual review, flag “Invalid or unusual SSN pattern”.
- **Handoff**: each submission creates a `HandoffRecord` with only non‑PII fields plus `applicantRef`.

## AI tool usage

- **Used for**: refactoring suggestions, test ideas, README wording, and edge‑case checks.
- **Validation**: ran tests, reviewed diffs, and manually exercised the submission flow to confirm behavior and avoid PII exposure.

## Tech choices

- **Frontend**: Next.js 16 (App Router), TypeScript, Bootstrap 5.
- **Backend**: Next.js API routes (`/api/applications`) so the app runs with a single `npm run dev` (no separate server or CORS).
- **Persistence**: In-memory only (no database).

## Next steps

1. **Security & data handling**: strict rate limits, input size caps, and redacted audit logging
2. **Idempotency & resilience**: idempotency key and request IDs for duplicate prevention and tracing
3. **Data retention**: TTL cleanup for in‑memory records and clear retention policy
4. **Auth/session**: authenticated applicant sessions and server‑side access control
5. **Schema contracts**: shared runtime schemas (e.g., Zod) for request/response and handoff
6. **Observability**: structured logs (no PII) and metrics for validation and review tiers
7. **Validation quality**: stronger DOB/phone/state validation and normalization
8. **API hardening**: versioned endpoints and consistent error envelopes

---

_ECE stipend application._
