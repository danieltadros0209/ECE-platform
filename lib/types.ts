export type ReviewTier = "standard" | "manual_review";

/**
 * Application payload from the UI.
 * SSN and DOB are sensitive—avoid logs and extra exposure.
 */
export interface ApplicationInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssn: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  programName: string;
  amountRequested: number;
  agreement: boolean;
}

/**
 * Stored application (includes id and triage result).
 * Kept only in memory; never returned in API responses or logs.
 */
export interface StoredApplication extends ApplicationInput {
  applicationId: string;
  submittedAt: string; // ISO
  reviewTier: ReviewTier;
  riskFlags: string[];
}

/**
 * Downstream handoff input: only what is needed for processing.
 */
export type HandoffInput = {
  applicationId: string;
  submittedAt: string;
  reviewTier: ReviewTier;
  riskFlags: string[];
  programName: string;
  amountRequested: number;
};

/**
 * Downstream handoff record: only what another system needs.
 * No PII (no SSN, full name, full address, DOB).
 */
export interface HandoffRecord extends HandoffInput {
  applicantRef: string; // for correlating with the original application if needed, but not containing PII itself
}

/** Safe API response: id and triage only, no PII. */
export interface ApplicationSubmitResponse {
  applicationId: string;
  reviewTier: ReviewTier;
  riskFlags: string[];
}

export type TriageResult = {
  reviewTier: ReviewTier;
  riskFlags: string[];
};
