import { auth } from './api-auth';

const myFetch = async url => {
  const { data } = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${btoa(`${auth.appID}:${auth.secret}`)}`,
    },
  }).then(r => r.json());
  return data;
};

export const PCO = {
  baseUrl: 'https://api.planningcenteronline.com/services/v2',

  getPlans: (serviceType, limit = 5, params = '') => {
    const url = `${PCO.baseUrl}/service_types/${serviceType}/plans?per_page=${limit}&${params}`;
    return myFetch(url);
  },

  getFuturePlans: (serviceType, limit = 5) => PCO.getPlans(serviceType, limit, 'filter=future'),

  getPlan: async (serviceType, planId) => {
    const plan = { serviceType, planId };
    const url = `${PCO.baseUrl}/service_types/${plan.serviceType}/plans/${plan.planId}`;

    const planData = await myFetch(url);
    plan.planTitle = planData.attributes.title;
    plan.planDates = planData.attributes.dates;

    const planNotesData = await myFetch(`${url}/notes`);
    const versionNote = planNotesData.filter(
      note => note.attributes.category_name === 'Information'
    );
    plan.planVersion = versionNote[0].attributes.content || 'NONE';

    return plan;
  },

  getPlanItems: async plan => {
    const url = `${PCO.baseUrl}/service_types/${plan.serviceType}/plans/${
      plan.planId
    }/items?per_page=100`;

    const itemsData = await myFetch(url);

    const items = itemsData.map(itemData => {
      const item = {
        description: itemData.attributes.description,
        details: itemData.attributes.html_details,
        id: itemData.id,
        key: itemData.attributes.key_name,
        length: itemData.attributes.length,
        notes: {},
        position: itemData.attributes.service_position,
        title: itemData.attributes.title,
        type: itemData.attributes.item_type,
      };
      return item;
    });
    return items;
  },

  getItemNotes: async (plan, item) => {
    const url = `${PCO.baseUrl}/service_types/${plan.serviceType}/plans/${plan.planId}/items/${
      item.id
    }/item_notes`;

    const itemNotes = {};
    const itemNotesData = await myFetch(url);

    itemNotesData.map(note => {
      itemNotes[note.attributes.category_name] = note.attributes.content;
      return null;
    });
    return itemNotes;
  },

  calculateTimes: items => {
    let elapsedTime = 0;
    return items
      .reverse()
      .map(item => {
        if (item.type === 'header') elapsedTime = 0;
        elapsedTime += item.length;
        item.clock = elapsedTime;
        return item;
      })
      .reverse();
  },
};
