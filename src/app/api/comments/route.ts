import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.PROJECT_URL;
const SUPABASE_KEY = process.env.PUBLISH_KEY; // Using public key for basic inserts/reads

export async function GET(req: NextRequest) {
  // Backend System Disabled
  return NextResponse.json({ message: "Comment system is currently disabled" }, { status: 403 });
  /*
  const path = req.nextUrl.searchParams.get("path");
  if (!path) return NextResponse.json({ error: "Path missing" }, { status: 400 });

  if (!SUPABASE_URL || !SUPABASE_KEY) {
     return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/comments?path=eq.${encodeURIComponent(path)}&order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        next: { tags: [`comments-${path}`] } 
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
  */
}

export async function POST(req: NextRequest) {
  // Backend System Disabled
  return NextResponse.json({ message: "Comment system is currently disabled" }, { status: 403 });
  /*
  try {
    const body = await req.json();
    const { path, nick, email, website, content } = body;

    if (!path || !nick || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY as string,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=representation"
      },
      body: JSON.stringify({ path, nick, email, website, content }),
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
  */
}
