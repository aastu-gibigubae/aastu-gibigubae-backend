export interface CreateMagazineInput {
  title: string;
  coverImage?: string | null;
  content?: string | null;
  pdfUrl: string;
  userId: string;
}

export interface UpdateMagazineInput {
  title?: string;
  coverImage?: string | null;
  content?: string | null;
  pdfUrl?: string;
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