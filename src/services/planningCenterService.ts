import { pcoClient } from "@/api/pcoClient";
import { calculateTimes, normalizeArrangement, normalizeNotes } from "@/services/planTransforms";
import type {
  Arrangement,
  ItemNotes,
  PlanDetails,
  PlanItem,
  PlanSummary,
} from "@/types/plans";

interface PcoListItem<TAttributes, TRelationships = Record<string, never>> {
  id: string;
  attributes: TAttributes;
  relationships: TRelationships;
}

interface PlanAttributes {
  dates: string;
  title: string | null;
}

interface NoteAttributes {
  category_name: string;
  content: string;
}

interface PlanItemAttributes {
  description: string | null;
  html_details: string | null;
  key_name: string | null;
  length: number;
  service_position: number;
  title: string;
  item_type: string;
}

interface PlanItemRelationships {
  arrangement: { data: { id: string } | null };
  song: { data: { id: string } | null };
}

interface ArrangementAttributes {
  bpm: number | null;
  name: string | null;
}

class PlanningCenterService {
  async getFuturePlans(serviceType: string, limit = 6): Promise<PlanSummary[]> {
    const plans = await pcoClient.get<PcoListItem<PlanAttributes>[]>(
      `/service_types/${serviceType}/plans?per_page=${limit}&filter=future`,
    );

    return plans.map((plan) => ({
      id: plan.id,
      serviceType,
      dates: plan.attributes.dates,
      title: plan.attributes.title,
    }));
  }

  async getPlanVersion(serviceType: string, planId: string): Promise<string> {
    const notes = await pcoClient.get<PcoListItem<NoteAttributes>[]>(
      `/service_types/${serviceType}/plans/${planId}/notes`,
    );

    const versionNote = notes.find(
      (note) => note.attributes.category_name === "Information",
    );

    return versionNote?.attributes.content || "NONE";
  }

  async getPlanBase(serviceType: string, planId: string): Promise<Omit<PlanDetails, "items">> {
    const plan = await pcoClient.get<PcoListItem<PlanAttributes>>(
      `/service_types/${serviceType}/plans/${planId}`,
    );

    return {
      serviceType,
      planId,
      planTitle: plan.attributes.title,
      planDates: plan.attributes.dates,
      planVersion: await this.getPlanVersion(serviceType, planId),
    };
  }

  async getPlanItems(serviceType: string, planId: string): Promise<PlanItem[]> {
    const items = await pcoClient.get<PcoListItem<PlanItemAttributes, PlanItemRelationships>[]>(
      `/service_types/${serviceType}/plans/${planId}/items?per_page=100`,
    );

    return items.map((item) => ({
      id: item.id,
      arrangementId: item.relationships.arrangement.data?.id ?? null,
      description: item.attributes.description,
      details: item.attributes.html_details,
      key: item.attributes.key_name,
      length: item.attributes.length,
      notes: {},
      position: item.attributes.service_position,
      songId: item.relationships.song.data?.id ?? null,
      title: item.attributes.title,
      type: item.attributes.item_type,
      clock: "",
      arrangement: null,
    }));
  }

  async getItemNotes(
    serviceType: string,
    planId: string,
    itemId: string,
  ): Promise<ItemNotes> {
    const notes = await pcoClient.get<PcoListItem<NoteAttributes>[]>(
      `/service_types/${serviceType}/plans/${planId}/items/${itemId}/item_notes`,
    );

    return notes.reduce<ItemNotes>((mappedNotes, note) => {
      mappedNotes[note.attributes.category_name] = note.attributes.content;
      return mappedNotes;
    }, {});
  }

  async getItemArrangement(songId: string, arrangementId: string): Promise<Arrangement> {
    const arrangement = await pcoClient.get<PcoListItem<ArrangementAttributes>>(
      `/songs/${songId}/arrangements/${arrangementId}`,
    );

    return {
      bpm: arrangement.attributes.bpm,
      name: arrangement.attributes.name,
    };
  }

  async getPlanDetails(serviceType: string, planId: string): Promise<PlanDetails> {
    const [plan, items] = await Promise.all([
      this.getPlanBase(serviceType, planId),
      this.getPlanItems(serviceType, planId),
    ]);

    const itemsWithDependencies = await Promise.all(
      items.map(async (item) => {
        const [notes, arrangement] = await Promise.all([
          this.getItemNotes(serviceType, planId, item.id),
          item.type === "song" && item.songId && item.arrangementId
            ? this.getItemArrangement(item.songId, item.arrangementId)
            : Promise.resolve(null),
        ]);

        return {
          ...item,
          notes: normalizeNotes(notes),
          arrangement: normalizeArrangement(arrangement),
        };
      }),
    );

    return {
      ...plan,
      items: calculateTimes(itemsWithDependencies),
    };
  }
}

export const planningCenterService = new PlanningCenterService();
