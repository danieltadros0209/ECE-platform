import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { validateApplication } from "@/lib/validation";
import { triageApplication } from "@/lib/triage";
import { saveApplication, saveHandoff } from "@/lib/store";
import { toHandoff } from "@/lib/handoff";
import type { StoredApplication, ApplicationSubmitResponse } from "@/lib/types";

const API_KEY_HEADER = "x-api-key";

export const runtime = "nodejs";

const getApiKey = (req: NextRequest): string | null => {
  return req.headers.get(API_KEY_HEADER)?.trim() ?? null;
};

const isAuthorized = (provided: string | null): boolean => {
  const expected = process.env.API_KEY;
  if (!expected) return false;
  return provided !== null && provided === expected;
};

export const POST = async (request: NextRequest) => {
  if (!isAuthorized(getApiKey(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON", errors: ["Request body must be valid JSON."] },
      { status: 400 },
    );
  }

  const validation = validateApplication(body);
  if (!validation.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        errors: validation.errors,
        fieldErrors: validation.fieldErrors,
      },
      { status: 400 },
    );
  }

  const input = validation.data;
  const { reviewTier, riskFlags } = triageApplication(input);

  const applicationId = randomUUID();
  const submittedAt = new Date().toISOString();

  const stored: StoredApplication = {
    ...input,
    applicationId,
    submittedAt,
    reviewTier,
    riskFlags,
  };

  saveApplication(stored);

  saveHandoff(toHandoff(stored));

  const response: ApplicationSubmitResponse = {
    applicationId,
    reviewTier,
    riskFlags,
  };

  return NextResponse.json(response, { status: 201 });
};
