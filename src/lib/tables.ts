export type TableDef = {
  id: string;
  label: string;
  kind: "visitor" | "category";
  seats: number;
  categories: string[];
  note: string;
};

export const TABLES: TableDef[] = [
  { id: "t1", label: "Table 1", kind: "visitor", seats: 8, categories: [], note: "Visitor table" },
  { id: "t2", label: "Table 2", kind: "visitor", seats: 8, categories: [], note: "Visitor table" },
  { id: "t3", label: "Table 3", kind: "visitor", seats: 8, categories: [], note: "Visitor table" },
  { id: "t5", label: "Table 5", kind: "visitor", seats: 8, categories: [], note: "Visitor table" },
  { id: "t6", label: "Table 6", kind: "visitor", seats: 8, categories: [], note: "Visitor table" },
  { id: "t7", label: "Table 7", kind: "category", seats: 10, categories: ["MS", "CS"], note: "Medical & corporate services" },
  { id: "t8", label: "Table 8", kind: "category", seats: 10, categories: ["FR", "IT"], note: "Finance & technology" },
  { id: "t9", label: "Table 9", kind: "category", seats: 10, categories: ["CE", "LF"], note: "Construction & lifestyle" },
  { id: "t10", label: "Table 10", kind: "category", seats: 10, categories: ["FB", "MP"], note: "Food & marketing" },
  { id: "t11", label: "Table 11", kind: "category", seats: 10, categories: ["ET"], note: "Education & substitutes" },
];

export const CATEGORIES = ["MS", "CS", "FR", "IT", "CE", "LF", "FB", "MP", "ET"];
