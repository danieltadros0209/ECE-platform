import { triageApplication } from "../triage";

const baseApplicant = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  phone: "555-123-4567",
  dateOfBirth: "1990-01-15",
  ssn: "123-45-6789", // will be flagged as unusual/test
  addressLine1: "123 Main St",
  city: "Boston",
  state: "MA",
  zipCode: "02101",
  programName: "ECE Grant",
  amountRequested: 500,
  agreement: true,
};

describe("triageApplication", () => {
  it("assigns manual_review when amount requested is above $1000", () => {
    const result = triageApplication({
      ...baseApplicant,
      ssn: "234-56-7890", // valid-ish pattern to avoid SSN flag
      amountRequested: 1500,
    });
    expect(result.reviewTier).toBe("manual_review");
    expect(result.riskFlags).toContain("Amount requested above threshold");
  });

  it("assigns manual_review when applicant is under 18", () => {
    const result = triageApplication({
      ...baseApplicant,
      ssn: "234-56-7890",
      dateOfBirth: new Date(Date.now() - 17 * 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      amountRequested: 500,
    });
    expect(result.reviewTier).toBe("manual_review");
    expect(result.riskFlags).toContain("Applicant under 18");
  });

  it("assigns standard when amount is at or below threshold and no other flags", () => {
    const result = triageApplication({
      ...baseApplicant,
      ssn: "234-56-7890",
      amountRequested: 1000,
      dateOfBirth: "1990-01-01",
    });
    expect(result.reviewTier).toBe("standard");
    expect(result.riskFlags).toEqual([]);
  });
});
