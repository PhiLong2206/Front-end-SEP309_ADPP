import { PaginationParams } from "./api.types";

export type EventStatus = "Upcoming" | "Ongoing" | "Completed" | "Cancelled";

export interface DebateEvent {
  id: string;
  title: string;
  description: string;
  topicId?: string;
  topicTitle?: string;
  educatorId: string;
  educatorName: string;
  startDate: string;
  endDate: string;
  location?: string;
  meetingLink?: string;
  maxParticipants: number;
  currentParticipants: number;
  status: EventStatus;
  bannerUrl?: string;
  createdAt: string;
  type?: "workshop" | "competition" | "seminar" | string;
  format?: string;
  rules?: string;
  organizer?: string;
  topic?: string;
  rounds?: number;
  prizePool?: string;
  entryFee?: number;
}

export interface CreateEventDto {
  title: string;
  description: string;
  topicId?: string;
  startDate: string;
  endDate: string;
  location?: string;
  meetingLink?: string;
  maxParticipants: number;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {
  status?: EventStatus;
}

export interface EventFilterParams extends PaginationParams {
  status?: EventStatus;
  educatorId?: string;
}
