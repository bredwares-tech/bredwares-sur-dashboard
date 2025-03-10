// app/api/videos/get-all-recordings/route.ts
import { createClient as createClientUser } from "@/utils/supabase/server";
import { createClient as createClientAdmin } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
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
    // Fetch all recordings
    const { data: recordings, error: recordingsError } = await supabaseAdmin
      .from("recordings")
      .select("*")
      .order("created_at", { ascending: false });

    if (recordingsError) {
      return NextResponse.json(
        { error: recordingsError.message },
        { status: 500 }
      );
    }

    // Filter out duplicates (Keep only the latest record for each unique title)
    const uniqueRecordings = Object.values(
      recordings.reduce(
        (acc, recording) => {
          if (!acc[recording.title]) {
            acc[recording.title] = recording;
          }
          return acc;
        },
        {} as Record<string, (typeof recordings)[0]>
      )
    );

    // Respond with filtered recordings (no duplicates)
    return NextResponse.json(uniqueRecordings);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch recordings" },
      { status: 500 }
    );
  }
}
