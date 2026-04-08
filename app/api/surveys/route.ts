import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { SurveyConfig } from "@/lib/survey-types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("surveys")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return NextResponse.json(
      { error: "Failed to fetch surveys" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, config, html_output } = body;

    if (!config) {
      return NextResponse.json(
        { error: "Survey config is required" },
        { status: 400 }
      );
    }

    const surveyName =
      name || `Survey ${new Date().toLocaleDateString("id-ID")}`;

    const { data, error } = await supabase
      .from("surveys")
      .insert([
        {
          name: surveyName,
          config,
          html_output,
        },
      ])
      .select();

    if (error) {
      console.error("[v0] Supabase error:", error);
      throw error;
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error("[v0] Error creating survey:", error);
    return NextResponse.json(
      { error: "Failed to create survey" },
      { status: 500 }
    );
  }
}
