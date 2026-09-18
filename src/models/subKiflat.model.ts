export interface CreateSubKiflatInput {
  kiflatId: string;
  name: string;
  description?: string | null;
  imageUrls?: string[];
}

export interface UpdateSubKiflatInput {
  kiflatId?: string;
  name?: string;
  description?: string | null;
  imageUrls?: string[];
}

export interface SubKiflatQuery {
  page: number;
  limit: number;
  search?: string;
  kiflatId?: string;
  sortBy:
    | "name"
    | "created_at"
    | "updated_at";
  sortOrder: "asc" | "desc";
}