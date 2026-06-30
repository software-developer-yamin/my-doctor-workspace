const JSON_ARRAY_FIELDS = [
  'field_of_concentration',
  'specializations',
  'educations',
  'languages',
  'conditions_treated',
  'insurance_accepted',
  'awards',
  'publications',
  'faqs',
  'videos',
  'services',
  'social_links',
] as const;

export function parseJsonArrayFields(payload: Record<string, unknown>): void {
  for (const field of JSON_ARRAY_FIELDS) {
    if (typeof payload[field] === 'string') {
      try {
        payload[field] = JSON.parse(payload[field] as string);
      } catch {
        throw new Error(`Invalid JSON in field: ${field}`);
      }
    }
  }
}
