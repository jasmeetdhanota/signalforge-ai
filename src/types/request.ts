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

export type RecommendedPriority = "High" | "Medium" | "Low";

export type SignalStrength = "Strong" | "Moderate" | "Emerging";

export interface PriorityRecommendation {
  priority: RecommendedPriority;
  demand: SignalStrength;
  recurrence: SignalStrength;
  confidence: number;
  reasoning: string;
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
  priorityRecommendation?: PriorityRecommendation;
}
