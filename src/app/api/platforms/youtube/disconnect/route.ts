import { NextRequest, NextResponse } from "next/server";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profileId, channelId } = body;

    // Update Supabase if configured
    const supabase = getServerSupabaseClient();
    if (supabase) {
      try {
        if (profileId) {
          await supabase
            .from("profiles")
            .update({
              youtube_connected: false,
              updated_at: new Date().toISOString(),
            })
            .eq("id", profileId);
        }

        if (channelId) {
          await supabase
            .from("connected_accounts")
            .update({
              status: "disconnected",
              last_synced_at: new Date().toISOString(),
            })
            .eq("platform", "youtube")
            .eq("platform_user_id", channelId);
        }
      } catch (dbErr) {
        console.warn("Supabase disconnect warning:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "YouTube channel disconnected successfully. Manual profile data preserved.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to disconnect YouTube channel" },
      { status: 500 }
    );
  }
}
