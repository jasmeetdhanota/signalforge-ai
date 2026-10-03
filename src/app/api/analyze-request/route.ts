import { NextResponse } from "next/server";

import { analyzeFeatureRequest } from "@/lib/ai/gemini";
import { createServerClient } from "@/lib/supabase/server";

interface AnalyzeRequestBody {
  requestId?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeRequestBody;
    const requestId = body.requestId?.trim();

    if (!requestId) {
      return NextResponse.json(
        { error: "A request ID is required." },
        { status: 400 },
      );
    }

    const supabase = createServerClient();

    const { data: featureRequest, error: requestError } = await supabase
      .from("feature_requests")
      .select("id, title, description, theme")
      .eq("id", requestId)
      .single();

    if (requestError || !featureRequest) {
      console.error("Feature request lookup failed:", requestError);

      return NextResponse.json(
        { error: "Feature request not found." },
        { status: 404 },
      );
    }

    const { data: existingRequests, error: existingRequestsError } =
      await supabase
        .from("feature_requests")
        .select("id, title, description, theme")
        .neq("id", requestId)
        .order("created_at", { ascending: false });

    if (existingRequestsError) {
      throw new Error(
        `Failed to load existing requests: ${existingRequestsError.message}`,
      );
    }

    try {
      const analysis = await analyzeFeatureRequest({
        title: featureRequest.title,
        description: featureRequest.description,
        existingRequests: existingRequests ?? [],
      });

      const { error: analysisError } = await supabase
        .from("request_analyses")
        .upsert(
          {
            request_id: requestId,
            customer_need: analysis.customerNeed,
            suggested_theme: analysis.suggestedTheme,
            reasoning: analysis.reasoning,
            confidence: analysis.confidence,
          },
          {
            onConflict: "request_id",
          },
        );

      if (analysisError) {
        throw new Error(
          `Failed to save request analysis: ${analysisError.message}`,
        );
      }

      const { error: deleteRelationshipsError } = await supabase
        .from("request_relationships")
        .delete()
        .eq("request_id", requestId);

      if (deleteRelationshipsError) {
        throw new Error(
          `Failed to refresh request relationships: ${deleteRelationshipsError.message}`,
        );
      }

      if (analysis.relatedRequests.length > 0) {
        const relationships = analysis.relatedRequests.map((relationship) => ({
          request_id: requestId,
          related_request_id: relationship.requestId,
          reasoning: relationship.reasoning,
          confidence: relationship.confidence,
        }));

        const { error: relationshipError } = await supabase
          .from("request_relationships")
          .insert(relationships);

        if (relationshipError) {
          throw new Error(
            `Failed to save request relationships: ${relationshipError.message}`,
          );
        }
      }

      return NextResponse.json({
        status: "completed",
        analysis,
      });
    } catch (error) {
      console.error("AI request analysis unavailable:", error);

      return NextResponse.json({
        status: "unavailable",
        analysis: null,
        message:
          "The feature request is saved, but AI analysis is temporarily unavailable.",
      });
    }
  } catch (error) {
    console.error("Request analysis route failed:", error);

    return NextResponse.json(
      {
        error: "Unable to process the analysis request.",
      },
      { status: 500 },
    );
  }
}
