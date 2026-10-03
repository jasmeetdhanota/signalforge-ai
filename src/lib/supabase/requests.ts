import { createClient } from "@/lib/supabase/client";
import { FeatureRequest, RequestStatus, RequestTheme } from "@/types/request";

export interface FeatureRequestRow {
  id: string;
  title: string;
  description: string;
  theme: string;
  status: string;
  support_count: number;
  created_at: string;
}

export function mapFeatureRequestRow(row: FeatureRequestRow): FeatureRequest {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    theme: row.theme as RequestTheme,
    status: row.status as RequestStatus,
    supportCount: row.support_count,
    relatedCount: 0,
    submittedAt: row.created_at.split("T")[0],
    trending: row.support_count >= 30,
  };
}

export async function getFeatureRequests(): Promise<FeatureRequest[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("feature_requests")
    .select("id, title, description, theme, status, support_count, created_at")
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
