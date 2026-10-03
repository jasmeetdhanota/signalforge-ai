import { createClient } from "@/lib/supabase/client";
import { FeatureRequest, RequestStatus, RequestTheme } from "@/types/request";

interface RequestAnalysisRow {
  customer_need: string;
  suggested_theme: string;
  reasoning: string;
  confidence: number;
}

interface RequestRelationshipRow {
  id: string;
}

export interface FeatureRequestRow {
  id: string;
  title: string;
  description: string;
  theme: string;
  status: string;
  support_count: number;
  created_at: string;
  request_analyses?: RequestAnalysisRow | RequestAnalysisRow[] | null;
  request_relationships?: RequestRelationshipRow[] | null;
}

function getRequestAnalysis(
  analysis: FeatureRequestRow["request_analyses"],
): RequestAnalysisRow | undefined {
  if (!analysis) {
    return undefined;
  }

  if (Array.isArray(analysis)) {
    return analysis[0];
  }

  return analysis;
}

export function mapFeatureRequestRow(row: FeatureRequestRow): FeatureRequest {
  const analysis = getRequestAnalysis(row.request_analyses);

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    theme: row.theme as RequestTheme,
    status: row.status as RequestStatus,
    supportCount: row.support_count,
    relatedCount: row.request_relationships?.length ?? 0,
    submittedAt: row.created_at.split("T")[0],
    trending: row.support_count >= 30,
    intelligence: analysis
      ? {
          customerNeed: analysis.customer_need,
          suggestedTheme: analysis.suggested_theme as RequestTheme,
          reasoning: analysis.reasoning,
          confidence: analysis.confidence,
        }
      : undefined,
  };
}

export async function getFeatureRequests(): Promise<FeatureRequest[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("feature_requests")
    .select(
      `
      id,
      title,
      description,
      theme,
      status,
      support_count,
      created_at,
      request_analyses (
        customer_need,
        suggested_theme,
        reasoning,
        confidence
      ),
      request_relationships!request_relationships_request_id_fkey (
        id
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load feature requests: ${error.message}`);
  }

  return (data as FeatureRequestRow[]).map(mapFeatureRequestRow);
}

export async function createFeatureRequest({
  title,
  description,
}: {
  title: string;
  description: string;
}): Promise<FeatureRequest> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("feature_requests")
    .insert({
      title,
      description,
    })
    .select("id, title, description, theme, status, support_count, created_at")
    .single();

  if (error) {
    throw new Error(`Failed to submit feature request: ${error.message}`);
  }

  return mapFeatureRequestRow(data as FeatureRequestRow);
}
