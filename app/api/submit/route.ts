import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export const POST = async (request: NextRequest) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 },
    );
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

  const target = request.nextUrl.searchParams.get("target");
  if (!target || !target.startsWith("/api/")) {
    return NextResponse.json(
      {
        error: "Invalid target",
        errors: ["Target must be an internal /api/ path."],
      },
      { status: 400 },
    );
  }

  const baseUrl = request.nextUrl.origin;
  const targetUrl = new URL(target, baseUrl);

  const res = await fetch(targetUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
};
