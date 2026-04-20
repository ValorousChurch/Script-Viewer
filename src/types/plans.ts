export interface PlanSummary {
  id: string;
  serviceType: string;
  dates: string;
  title: string | null;
}

export interface Arrangement {
  bpm: number | null;
  name: string | null;
}

export type ItemNotes = Record<string, string>;

export interface PlanItem {
  id: string;
  arrangementId: string | null;
  description: string | null;
  details: string | null;
  key: string | null;
  length: number;
  notes: ItemNotes;
  position: number;
  songId: string | null;
  title: string;
  type: string;
  clock: number | "";
  arrangement: Arrangement | null;
}

export interface PlanDetails {
  serviceType: string;
  planId: string;
  planTitle: string | null;
  planDates: string;
  planVersion: string;
  items: PlanItem[];
}

export interface PlanTemplateColumn {
  title: string;
  notes: string[];
}

export interface PlanTemplate {
  name: "default" | "audio" | "video" | "lighting" | "stage";
  label: string;
  columns: PlanTemplateColumn[];
}

export interface PlanRow {
  id: string;
  type: "header" | "item";
  clockDisplay: string;
  lengthDisplay: string;
  title: string;
  descriptionHtml: string;
  noteColumns: string[];
}
