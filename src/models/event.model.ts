export interface CreateEventInput {
  title: string;
  description: string;
  imageUrl?: string | null;
  location: string;
  eventDate: string;
  isPublished?: boolean;
  userId: string;
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  imageUrl?: string | null;
  location?: string;
  eventDate?: string;
  isPublished?: boolean;
}

export interface EventQuery {
  page: number;
  limit: number;
  search?: string;
  fromDate?: Date;
  toDate?: Date;
  sortBy: "event_date" | "title" | "created_at";
  sortOrder: "asc" | "desc";
}