export const ITEM_CATEGORIES = [
  "Elektronik",
  "Ev Aleti",
  "Mobilya",
  "Spor",
  "Kişisel",
  "Diğer",
] as const;

export const ITEM_CONDITIONS = [
  "Çok iyi",
  "İyi",
  "Bakım gerekli",
  "Arızalı",
] as const;

export type ItemCategory = (typeof ITEM_CATEGORIES)[number];
export type ItemCondition = (typeof ITEM_CONDITIONS)[number];

export interface ItemRecord {
  id: string;
  name: string;
  category: ItemCategory;
  brand: string;
  model: string;
  location: string;
  purchaseDate: string;
  warrantyEnd: string;
  nextMaintenance: string;
  condition: ItemCondition;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type ItemFormData = Omit<
  ItemRecord,
  "id" | "createdAt" | "updatedAt"
>;
