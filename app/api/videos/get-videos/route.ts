// app/api/videos/get-videos/route.ts
import { createClient as createClientUser } from "@/utils/supabase/server";
import { createClient as createClientAdmin } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const clerkId = request.nextUrl.searchParams.get("clerkId");
  const date = request.nextUrl.searchParams.get("date");

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
    // Start building the query
    let query = supabaseAdmin
      .from("recordings")
      .select("*")
      .eq("clerk_user_id", clerkId);

    // If date parameter is provided, filter by date
    if (date) {
      // Convert the date parameter to the start and end of the day in ISO format
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      // Filter recordings by created_at between start and end of the selected day
      query = query
        .gte("created_at", startOfDay.toISOString())
        .lte("created_at", endOfDay.toISOString());
    }

    // Execute the query
    const { data: recordings, error: recordingsError } = await query;

    if (recordingsError) {
      return NextResponse.json(
        { error: recordingsError.message },
        { status: 500 }
      );
    }

    // Respond with filtered recordings
    return NextResponse.json(recordings);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch recordings" },
      { status: 500 }
    );
  }
}
