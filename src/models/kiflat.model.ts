export interface CreateKiflatInput {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
}

export interface UpdateKiflatInput {
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
}

export interface KiflatQuery {
  page: number;
  limit: number;
  search?: string;
  sortBy: "name" | "created_at" | "updated_at";
  sortOrder: "asc" | "desc";
}