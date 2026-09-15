import axiosClient from "./axiosClient";
import {
  Topic,
  TopicMaterial,
  CreateTopicDto,
  UpdateTopicDto,
  TopicFilterParams,
  ApiResponse,
  PaginatedResponse,
} from "../types";

const topicApi = {
  getAll: (params?: TopicFilterParams): Promise<ApiResponse<PaginatedResponse<Topic>>> =>
    axiosClient.get("/topics", { params }),

  getById: (id: string): Promise<ApiResponse<Topic>> =>
    axiosClient.get(`/topics/${id}`),

  getCategories: (): Promise<ApiResponse<string[]>> =>
    axiosClient.get("/topics/categories"),

  create: (data: CreateTopicDto): Promise<ApiResponse<Topic>> =>
    axiosClient.post("/topics", data),

  update: (id: string, data: UpdateTopicDto): Promise<ApiResponse<Topic>> =>
    axiosClient.put(`/topics/${id}`, data),

  delete: (id: string): Promise<ApiResponse<void>> =>
    axiosClient.delete(`/topics/${id}`),

  // Materials
  getMaterials: (topicId: string): Promise<ApiResponse<TopicMaterial[]>> =>
    axiosClient.get(`/topics/${topicId}/materials`),

  addMaterial: (
    topicId: string,
    data: { title: string; content: string; sourceUrl?: string }
  ): Promise<ApiResponse<TopicMaterial>> =>
    axiosClient.post(`/topics/${topicId}/materials`, data),

  deleteMaterial: (topicId: string, materialId: string): Promise<ApiResponse<void>> =>
    axiosClient.delete(`/topics/${topicId}/materials/${materialId}`),
};

export default topicApi;
