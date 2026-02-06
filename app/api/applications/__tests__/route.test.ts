import { NextRequest } from "next/server";
import { POST } from "../route";

const buildRequest = (body: object, apiKey: string | null): NextRequest => {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (apiKey !== null) headers.set("x-api-key", apiKey);
  return new NextRequest("http://localhost/api/applications", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
};

const validBody = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  phone: "555-123-4567",
  dateOfBirth: "1990-01-15",
  ssn: "234-56-7890",
  addressLine1: "123 Main St",
  city: "Boston",
  state: "MA",
  zipCode: "02101",
  programName: "ECE Grant",
  amountRequested: 500,
  agreement: true,
};

describe("POST /api/applications", () => {
  const originalEnv = process.env.API_KEY;

  afterEach(() => {
    process.env.API_KEY = originalEnv;
  });

  it("returns 401 when X-API-Key header is missing", async () => {
    process.env.API_KEY = "secret";
    const res = await POST(buildRequest(validBody, null));
    expect(res.status).toBe(401);
  });

  it("returns 401 when X-API-Key is wrong", async () => {
    process.env.API_KEY = "secret";
    const res = await POST(buildRequest(validBody, "wrong-key"));
    expect(res.status).toBe(401);
  });

  it("returns 201 and applicationId when key is valid", async () => {
    process.env.API_KEY = "secret";
    const res = await POST(buildRequest(validBody, "secret"));
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data).toHaveProperty("applicationId");
    expect(data).toHaveProperty("reviewTier");
    expect(data).toHaveProperty("riskFlags");
    expect(data.reviewTier).toMatch(/^(standard|manual_review)$/);
  });
});
