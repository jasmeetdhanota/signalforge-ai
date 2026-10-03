import { FeatureRequest, PriorityRecommendation } from "@/types/request";

function getDemandLevel(
  supportCount: number,
): PriorityRecommendation["demand"] {
  if (supportCount >= 30) {
    return "Strong";
  }

  if (supportCount >= 15) {
    return "Moderate";
  }

  return "Emerging";
}

function getRecurrenceLevel(
  relatedCount: number,
): PriorityRecommendation["recurrence"] {
  if (relatedCount >= 2) {
    return "Strong";
  }

  if (relatedCount === 1) {
    return "Moderate";
  }

  return "Emerging";
}

export function getPriorityRecommendation(
  request: FeatureRequest,
): PriorityRecommendation | undefined {
  if (!request.intelligence) {
    return undefined;
  }

  const demand = getDemandLevel(request.supportCount);
  const recurrence = getRecurrenceLevel(request.relatedCount);
  const confidence = request.intelligence.confidence;

  let score = 0;

  if (demand === "Strong") {
    score += 2;
  } else if (demand === "Moderate") {
    score += 1;
  }

  if (recurrence === "Strong") {
    score += 2;
  } else if (recurrence === "Moderate") {
    score += 1;
  }

  if (confidence >= 0.85) {
    score += 1;
  }

  const priority = score >= 4 ? "High" : score >= 2 ? "Medium" : "Low";

  const reasoning =
    priority === "High"
      ? "Strong customer demand and recurring signals suggest this need deserves near-term product review."
      : priority === "Medium"
        ? "Meaningful customer evidence is present, but the signal should be weighed against product strategy and delivery effort."
        : "The signal is still emerging. Continue gathering customer evidence before increasing product priority.";

  return {
    priority,
    demand,
    recurrence,
    confidence,
    reasoning,
  };
}
