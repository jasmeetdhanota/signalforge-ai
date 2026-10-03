export type RequestStatus = "New" | "Under Review" | "Planned" | "In Progress";

export type RequestTheme =
  | "Analytics"
  | "Workflow"
  | "Integrations"
  | "Mobile"
  | "Collaboration";

export interface RequestIntelligence {
  customerNeed: string;
  suggestedTheme: RequestTheme;
  reasoning: string;
  confidence: number;
}

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  theme: RequestTheme;
  status: RequestStatus;
  supportCount: number;
  relatedCount: number;
  submittedAt: string;
  trending?: boolean;
  intelligence?: RequestIntelligence;
}
