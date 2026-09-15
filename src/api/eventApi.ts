import axiosClient from "./axiosClient";
import {
  DebateEvent,
  CreateEventDto,
  UpdateEventDto,
  EventFilterParams,
  ApiResponse,
  PaginatedResponse,
} from "../types";

const eventApi = {
  // Public & Learner
  getAllEvents: (params?: EventFilterParams): Promise<ApiResponse<PaginatedResponse<DebateEvent>>> =>
    axiosClient.get("/events", { params }),

  getEventById: (id: string): Promise<ApiResponse<DebateEvent>> =>
    axiosClient.get(`/events/${id}`),

  registerEvent: (id: string): Promise<ApiResponse<{ registrationId: string }>> =>
    axiosClient.post(`/events/${id}/register`),

  cancelRegistration: (id: string): Promise<ApiResponse<void>> =>
    axiosClient.delete(`/events/${id}/register`),

  getMyEvents: (): Promise<ApiResponse<DebateEvent[]>> =>
    axiosClient.get("/events/my-events"),

  // Educator & Admin Management
  createEvent: (data: CreateEventDto): Promise<ApiResponse<DebateEvent>> =>
    axiosClient.post("/events", data),

  updateEvent: (id: string, data: UpdateEventDto): Promise<ApiResponse<DebateEvent>> =>
    axiosClient.put(`/events/${id}`, data),

  deleteEvent: (id: string): Promise<ApiResponse<void>> =>
    axiosClient.delete(`/events/${id}`),

  getEventParticipants: (id: string): Promise<ApiResponse<unknown[]>> =>
    axiosClient.get(`/events/${id}/participants`),
};

export default eventApi;
