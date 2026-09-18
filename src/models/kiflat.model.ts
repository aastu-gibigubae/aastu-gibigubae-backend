export interface CreateKiflatInput {
  name: string;
  description?: string | null;
  imageUrls?: string[];
}

export interface UpdateKiflatInput {
  name?: string;
  description?: string | null;
  imageUrls?: string[];
}

export interface KiflatQuery {
  page: number;
  limit: number;
  search?: string;
  sortBy: "name" | "created_at" | "updated_at";
  sortOrder: "asc" | "desc";
}