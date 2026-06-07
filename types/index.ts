export type DocumentCategory =
  | "Astronomy"
  | "Missions"
  | "Satellites"
  | "Deep Space"
  | "Earth Observation"
  | "Research";

export interface SpaceDocument {
  id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  contributor: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  tags: string[];
  downloads: number;
  country: string;
}

export const CATEGORIES: DocumentCategory[] = [
  "Astronomy",
  "Missions",
  "Satellites",
  "Deep Space",
  "Earth Observation",
  "Research",
];

export const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "text/csv": [".csv"],
  "application/json": [".json"],
  "text/plain": [".txt"],
  "application/zip": [".zip"],
  "application/x-fits": [".fits"],
};
