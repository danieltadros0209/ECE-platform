import type { StoredApplication, HandoffRecord, HandoffInput } from "./types";

const buildHandoffInput = (app: StoredApplication): HandoffInput => {
  return {
    applicationId: app.applicationId,
    submittedAt: app.submittedAt,
    reviewTier: app.reviewTier,
    riskFlags: app.riskFlags,
    programName: app.programName,
    amountRequested: app.amountRequested,
  };
};

export const toHandoff = (app: StoredApplication): HandoffRecord => {
  const input = buildHandoffInput(app);
  return {
    ...input,
    applicantRef: `app-${app.applicationId}`,
  };
};
