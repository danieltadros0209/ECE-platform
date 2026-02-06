import type { ApplicationInput, ReviewTier, TriageResult } from "./types";
import { hasUnusualSsn } from "./validation";

const MANUAL_REVIEW_AMOUNT_THRESHOLD = 1000;

function ageFromDob(dateOfBirth: string): number | null {
  const parsed = new Date(dateOfBirth);
  if (Number.isNaN(parsed.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - parsed.getFullYear();
  const monthDelta = today.getMonth() - parsed.getMonth();

  if (
    monthDelta < 0 ||
    (monthDelta === 0 && today.getDate() < parsed.getDate())
  ) {
    age -= 1;
  }

  return age;
}

function isUnder18(dateOfBirth: string): boolean {
  const age = ageFromDob(dateOfBirth);
  return age !== null && age < 18;
}

function isAmountHigh(amountRequested: number): boolean {
  return amountRequested > MANUAL_REVIEW_AMOUNT_THRESHOLD;
}

/**
 * Triage rules for `reviewTier` and `riskFlags`.
 * Keep PII out of flag text.
 */
export function triageApplication(input: ApplicationInput): TriageResult {
  const flags: string[] = [];

  if (isAmountHigh(input.amountRequested)) {
    flags.push("Amount requested above threshold");
  }

  if (isUnder18(input.dateOfBirth)) {
    flags.push("Applicant under 18");
  }

  if (hasUnusualSsn(input.ssn)) {
    flags.push("Invalid or unusual SSN pattern");
  }

  const reviewTier: ReviewTier =
    flags.length > 0 ? "manual_review" : "standard";
  return { reviewTier, riskFlags: flags };
}
