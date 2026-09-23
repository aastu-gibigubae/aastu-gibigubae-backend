import { MediaType } from "../generated/prisma/enums.js";

export interface CreateMediaItemInput {
  title: string;
  description?: string | null;
  media_url: string;
  thumbnail_url?: string | null;
  media_type: MediaType;
  userId: string;
}

export interface UpdateMediaItemInput {
  title?: string;
  description?: string | null;
  media_url?: string;
  thumbnail_url?: string | null;
  media_type?: MediaType;
}

export interface MediaItemQuery {
  page: number;
  limit: number;
  search?: string;
  media_type?: MediaType;
  fromDate?: Date;
  toDate?: Date;
  sortBy: "created_at" | "title";
  sortOrder: "asc" | "desc";
}
