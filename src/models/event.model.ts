export interface CreateEventInput {
  title: string;
  description: string;
  imageUrl?: string | null;
  location: string;
  eventDate: string;
  isPublished?: boolean;
  createdBy: string;
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
  page?: number;
  limit?: number;
}