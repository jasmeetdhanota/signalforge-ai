import { FeatureRequest } from "@/types/request";

export const mockRequests: FeatureRequest[] = [
  {
    id: "req-001",
    title: "Bulk export for analytics reports",
    description:
      "Our operations team needs to export multiple reports at once instead of downloading each report individually.",
    theme: "Analytics",
    status: "Under Review",
    supportCount: 42,
    relatedCount: 6,
    submittedAt: "2026-09-28",
    trending: true,
  },
  {
    id: "req-002",
    title: "Slack notifications for workflow updates",
    description:
      "Teams want important workflow changes delivered directly to Slack so they can respond without constantly checking the dashboard.",
    theme: "Integrations",
    status: "Planned",
    supportCount: 35,
    relatedCount: 4,
    submittedAt: "2026-09-24",
    trending: true,
  },
  {
    id: "req-003",
    title: "Saved dashboard views",
    description:
      "Users need to save frequently used filters and dashboard configurations so recurring analysis takes less time.",
    theme: "Analytics",
    status: "Under Review",
    supportCount: 28,
    relatedCount: 5,
    submittedAt: "2026-09-21",
  },
  {
    id: "req-004",
    title: "Approval steps for high-impact changes",
    description:
      "Enterprise teams need configurable approval steps before important workflow changes can be published.",
    theme: "Workflow",
    status: "In Progress",
    supportCount: 24,
    relatedCount: 3,
    submittedAt: "2026-09-18",
  },
  {
    id: "req-005",
    title: "Mobile-friendly request review",
    description:
      "Product managers want to review customer requests and update their status from a phone when they are away from their desk.",
    theme: "Mobile",
    status: "New",
    supportCount: 17,
    relatedCount: 2,
    submittedAt: "2026-09-15",
  },
  {
    id: "req-006",
    title: "Mention teammates in product discussions",
    description:
      "Teams want to mention colleagues when discussing customer needs so the right people can contribute context.",
    theme: "Collaboration",
    status: "New",
    supportCount: 14,
    relatedCount: 3,
    submittedAt: "2026-09-12",
  },
];
