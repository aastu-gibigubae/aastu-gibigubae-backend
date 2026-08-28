export interface CreateMagazineInput {
  title: string;
  coverImageUrl?: string | null;
  content?: string | null;
  fileUrl: string;
  createdBy: string;
}

export interface UpdateMagazineInput {
  title?: string;
  coverImageUrl?: string | null;
  content?: string | null;
  fileUrl?: string;
}

export interface MagazineQuery {
  page: number;
  limit: number;
  search?: string;
  fromDate?: Date;
  toDate?: Date;
  sortBy: "published_at" | "title";
  sortOrder: "asc" | "desc";
}