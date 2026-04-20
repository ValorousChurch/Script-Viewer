import type {
  Arrangement,
  ItemNotes,
  PlanItem,
  PlanRow,
  PlanTemplate,
} from "@/types/plans";

function secToTime(seconds: number): string {
  return new Date(seconds * 1000).toISOString().slice(14, 19);
}

export function calculateTimes(items: PlanItem[]): PlanItem[] {
  let elapsedTime = 0;
  const reversed = [...items].reverse();

  const withClocks = reversed.map((item) => {
    const nextItem = { ...item };

    if (nextItem.type === "header") {
      elapsedTime = 0;
    }

    elapsedTime += nextItem.length;
    nextItem.clock = nextItem.length > 0 ? elapsedTime : "";

    return nextItem;
  });

  return withClocks.reverse();
}

export function normalizeNotes(notes: ItemNotes): ItemNotes {
  return Object.entries(notes).reduce<ItemNotes>((normalized, [key, value]) => {
    normalized[key] = value ?? "";
    return normalized;
  }, {});
}

export function normalizeArrangement(arrangement: Arrangement | null): Arrangement | null {
  if (!arrangement) {
    return null;
  }

  return {
    bpm: arrangement.bpm ?? null,
    name: arrangement.name ?? null,
  };
}

export function buildDescriptionHtml(item: PlanItem, templateName: string): string {
  let description = "";

  if (templateName === "audio" && item.type === "song") {
    description += `[<em>Key: ${item.key ?? ""}, BPM: ${item.arrangement?.bpm ?? ""}</em>] `;
  }

  description += item.notes.Vocals || "";

  if (item.details) {
    description += `<hr /> ${item.details}`;
  }

  return description;
}

export function buildTemplateColumnHtml(item: PlanItem, noteTitles: string[]): string {
  return noteTitles
    .map((noteTitle) => {
      if (noteTitle === "Source" && item.notes.Source) {
        return `<span class="source">${item.notes.Source}</span>`;
      }

      return item.notes[noteTitle] ?? "";
    })
    .filter(Boolean)
    .join("<br />");
}

export function shapePlanRows(
  items: PlanItem[],
  template: PlanTemplate,
  templateName: string,
): PlanRow[] {
  return items.map((item) => {
    if (item.type === "header") {
      return {
        id: item.id,
        type: "header",
        clockDisplay: "",
        lengthDisplay: "",
        title: item.title,
        descriptionHtml: "",
        noteColumns: [],
      };
    }

    return {
      id: item.id,
      type: "item",
      clockDisplay: typeof item.clock === "number" ? secToTime(item.clock) : "",
      lengthDisplay: item.length > 0 ? secToTime(item.length) : "--:--",
      title: item.title,
      descriptionHtml: buildDescriptionHtml(item, templateName),
      noteColumns: template.columns.map((column) => buildTemplateColumnHtml(item, column.notes)),
    };
  });
}
