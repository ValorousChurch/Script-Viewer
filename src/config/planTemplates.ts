import type { PlanTemplate } from "@/types/plans";

export const serviceTypeOptions = [
  {
    id: "41396",
    label: "Weekend Production",
  },
] as const;

export const planTemplates: Record<PlanTemplate["name"], PlanTemplate> = {
  default: {
    name: "default",
    label: "Default",
    columns: [
      { title: "Side Screens", notes: ["Sides"] },
      { title: "Center Screen", notes: ["Center"] },
      { title: "Other", notes: ["Other", "Source"] },
    ],
  },
  audio: {
    name: "audio",
    label: "Audio",
    columns: [
      { title: "Side Screens", notes: ["Sides"] },
      { title: "Audio", notes: ["Audio", "Source"] },
    ],
  },
  video: {
    name: "video",
    label: "Video",
    columns: [
      { title: "Side Screens", notes: ["Sides"] },
      { title: "Center Screen", notes: ["Center"] },
      { title: "Video", notes: ["Video", "Source"] },
    ],
  },
  lighting: {
    name: "lighting",
    label: "Lighting",
    columns: [
      { title: "Side Screens", notes: ["Sides"] },
      { title: "Lighting", notes: ["Lighting"] },
    ],
  },
  stage: {
    name: "stage",
    label: "Stage",
    columns: [{ title: "Stage", notes: ["Stage"] }],
  },
};

export function resolveTemplateName(templateName?: string): PlanTemplate["name"] {
  if (!templateName) {
    return "default";
  }

  return templateName in planTemplates
    ? (templateName as PlanTemplate["name"])
    : "default";
}
