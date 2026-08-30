export interface CreateSubKiflatInput {
  kiflatId: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
}

export interface UpdateSubKiflatInput {
  kiflatId?: string;
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
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