import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.PROJECT_URL;
const SUPABASE_KEY = process.env.PUBLISH_KEY;

// Rate limit: max 2 submissions per device per month
const MONTHLY_LIMIT = 2;

function getDeviceId(req: NextRequest): string {
  // Use a combination of IP + User-Agent as device fingerprint
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const ua = req.headers.get("user-agent") || "unknown";
  // Simple hash
  let hash = 0;
  const str = ip + ua;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export async function POST(req: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  let body: {
    name: string;
    nickname: string;
    description: string;
    url: string;
    avatar: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, nickname, description, url, avatar } = body;

  if (!name || !url || !avatar) {
    return NextResponse.json({ error: "name, url, and avatar are required" }, { status: 400 });
  }

  // Basic URL validation
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return NextResponse.json({ error: "URL must use HTTP or HTTPS" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
  }

  const deviceId = getDeviceId(req);

  // Check monthly submission count for this device
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const checkRes = await fetch(
    `${SUPABASE_URL}/rest/v1/friend_requests?device_id=eq.${deviceId}&created_at=gte.${startOfMonth}&select=id`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    }
  );

  if (!checkRes.ok) {
    return NextResponse.json({ error: "Failed to check rate limit" }, { status: 500 });
  }

  const existing = await checkRes.json();

  if (Array.isArray(existing) && existing.length >= MONTHLY_LIMIT) {
    // Calculate next month reset date
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const resetDate = nextMonth.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    return NextResponse.json(
      {
        error: "rate_limit",
        message: `Kamu sudah mengirim ${MONTHLY_LIMIT} permintaan bulan ini. Coba lagi setelah ${resetDate}.`,
        resetDate,
      },
      { status: 429 }
    );
  }

  // Insert the request
  const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/friend_requests`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      name,
      nickname: nickname || name,
      description: description || "",
      url,
      avatar,
      device_id: deviceId,
      status: "pending",
    }),
  });

  if (!insertRes.ok) {
    const err = await insertRes.text();
    console.error("Supabase insert error:", err);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Permintaan berhasil dikirim! Akan direview secara manual." });
}
