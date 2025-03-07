// app/api/videos/get-user-videos/route.ts
import { createClient as createClientUser } from "@/utils/supabase/server";
import { createClient as createClientAdmin } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const clerkId = request.nextUrl.searchParams.get("clerkId");

  if (!clerkId) {
    return NextResponse.json(
      { error: "Missing clerkId parameter" },
      { status: 400 }
    );
  }

  const supabase = await createClientUser();

  // Check for user session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  // If session not found or there's an error, return 401 Unauthorized
  if (sessionError || !session) {
    return NextResponse.json(
      { error: "No session found. Unauthorized." },
      { status: 401 }
    );
  }

  const supabaseAdmin = createClientAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Fetch only recordings for the specific clerk_user_id
    const { data: recordings, error: recordingsError } = await supabaseAdmin
      .from("recordings")
      .select("*")
      .eq("clerk_user_id", clerkId);

    if (recordingsError) {
      return NextResponse.json(
        { error: recordingsError.message },
        { status: 500 }
      );
    }

    // Respond with user's recordings
    return NextResponse.json(recordings);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch recordings" },
      { status: 500 }
    );
  }
}
