import type { StoredApplication, HandoffRecord } from "../types";

const TEST_ENCRYPTION_KEY = "AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE=";
process.env.ENCRYPTION_KEY = TEST_ENCRYPTION_KEY;

function sampleApplication(id: string): StoredApplication {
  return {
    applicationId: id,
    submittedAt: new Date("2025-01-01T00:00:00.000Z").toISOString(),
    reviewTier: "standard",
    riskFlags: [],
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    phone: "555-123-4567",
    dateOfBirth: "1990-01-15",
    ssn: "234-56-7890",
    addressLine1: "123 Main St",
    addressLine2: "Apt 1",
    city: "Boston",
    state: "MA",
    zipCode: "02101",
    programName: "ECE Grant",
    amountRequested: 500,
    agreement: true,
  };
}

function sampleHandoff(id: string): HandoffRecord {
  return {
    applicationId: id,
    submittedAt: new Date("2025-01-01T00:00:00.000Z").toISOString(),
    reviewTier: "standard",
    riskFlags: [],
    programName: "ECE Grant",
    amountRequested: 500,
    applicantRef: `app-${id}`,
  };
}

describe("HMR-safe in-memory store", () => {
  it("persists applications across module reloads", async () => {
    const id = `app-${Date.now()}`;
    const store1 = await import("../store");
    store1.saveApplication(sampleApplication(id));

    jest.resetModules();

    const store2 = await import("../store");
    expect(store2.getApplication(id)).toBeDefined();
  });

  it("persists handoffs across module reloads", async () => {
    const id = `handoff-${Date.now()}`;
    const store1 = await import("../store");
    store1.saveHandoff(sampleHandoff(id));

    jest.resetModules();

    const store2 = await import("../store");
    expect(store2.getHandoff(id)).toBeDefined();
  });
});
